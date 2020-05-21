package com.appsmith.server.services;

import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.acl.AppsmithRole;
import com.appsmith.server.domains.Organization;
import com.appsmith.server.domains.User;
import com.appsmith.server.domains.UserRole;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface OrganizationService extends CrudService<Organization, String> {

    Mono<Organization> create(Organization organization);

    Mono<Organization> getBySlug(String slug);

    Mono<String> getNextUniqueSlug(String initialSlug);

    Mono<Organization> create(Organization organization, User user);

    Mono<Organization> findById(String id);

    Mono<Organization> findById(String id, AclPermission permission);

    Mono<Organization> save(Organization organization);

    Mono<Organization> findByIdAndPluginsPluginId(String organizationId, String pluginId);

    Flux<Organization> findByIdsIn(Set<String> ids,AclPermission permission);

    Mono<Map<String, String>> getUserRolesForOrganization();

    Mono<Organization> addUserRoleToOrganization(Organization organization, User user, AppsmithRole role);

    Mono<Organization> removeUserRoleFromOrganization(Organization organization, User user);

    Mono<List<UserRole>> getOrganizationMembers(String orgId);
}
