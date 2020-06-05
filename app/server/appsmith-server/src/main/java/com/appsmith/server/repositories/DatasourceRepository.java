package com.appsmith.server.repositories;

import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.Datasource;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface DatasourceRepository extends BaseRepository<Datasource, String>, CustomDatasourceRepository {

    @Query(value = "{" + FieldName.NAME + ": {$regex: ?0}}", count = true)
    Mono<Long> countNamesByPrefix(String namePrefix);
}
