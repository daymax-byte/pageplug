package com.appsmith.server.configurations;

import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.Organization;
import com.appsmith.server.domains.Page;
import com.appsmith.server.domains.User;
import com.appsmith.server.domains.UserState;
import com.appsmith.server.repositories.ApplicationRepository;
import com.appsmith.server.repositories.OrganizationRepository;
import com.appsmith.server.repositories.PageRepository;
import com.appsmith.server.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Configuration
public class SeedMongoData {

    @Bean
    ApplicationRunner init(UserRepository userRepository,
                           OrganizationRepository organizationRepository,
                           ApplicationRepository applicationRepository,
                           PageRepository pageRepository) {
        log.info("Seeding the data");
        Object[][] userData = {
                {"user test", "usertest@usertest.com", UserState.ACTIVATED},
                {"api_user", "api_user", UserState.ACTIVATED},
        };
        Object[][] orgData = {
                {"Spring Test Organization", "appsmith-spring-test.com", "appsmith.com"}
        };
        Object[][] appData = {
                {"LayoutServiceTest TestApplications"}
        };
        Object[][] pageData = {
                {"validPageName"}
        };
        return args -> {
            organizationRepository.deleteAll()
                    .thenMany(
                            // Seed the organization data into the DB
                            Flux.just(orgData)
                                    .map(array -> {
                                        Organization organization = new Organization();
                                        organization.setName((String) array[0]);
                                        organization.setDomain((String) array[1]);
                                        organization.setWebsite((String) array[2]);
                                        return organization;
                                    }).flatMap(organizationRepository::save)
                    )
                    // Query the seed data to get the organizationId (required for application creation)
                    .then(organizationRepository.findByName((String) orgData[0][0]))
                    .map(org -> org.getId())
                    // Seed the user data into the DB
                    .flatMapMany(orgId -> Flux.just(userData)
                            .map(array -> {
                                User user = new User();
                                user.setName((String) array[0]);
                                user.setEmail((String) array[1]);
                                user.setState((UserState) array[2]);
                                user.setOrganizationId(orgId);
                                return user;
                            })
                            .flatMap(userRepository::save)
                            .then(Mono.just(orgId))
                    ).flatMap(orgId ->
                    // Seed the application data into the DB
                    Flux.just(appData).map(array -> {
                        Application app = new Application();
                        app.setName((String) array[0]);
                        app.setOrganizationId(orgId);
                        return app;
                    }).flatMap(applicationRepository::save)
                    // Query the seed data to get the applicationId (required for page creation)
            ).then(applicationRepository.findByName((String) appData[0][0]))
                    .map(application -> application.getId())
                    .flatMapMany(appId -> Flux.just(pageData)
                            // Seed the page data into the DB
                            .map(array -> {
                                Page page = new Page();
                                page.setName((String) array[0]);
                                page.setApplicationId(appId);
                                return page;
                            })
                            .flatMap(pageRepository::save)
                    ).subscribe(obj -> log.info("Last Saved Object: " + obj));
        };
    }
}
