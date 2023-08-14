package com.appsmith.server.dtos;

import com.appsmith.external.models.Datasource;
import com.appsmith.external.models.DatasourceConfiguration;
import com.appsmith.external.models.DatasourceStorage;
import com.appsmith.external.views.Views;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Transient;

import java.util.HashSet;
import java.util.Set;

// This class is not under consumption right now
@Getter
@Setter
@Slf4j
public class DatasourceDTO {

    String id;

    @Transient
    public Set<String> userPermissions = new HashSet<>();

    @JsonView(Views.Public.class)
    String name;

    @JsonView(Views.Public.class)
    String pluginId;

    // name of the plugin. used to log analytics events where pluginName is a required attribute
    // It'll be null if not set
    @Transient
    @JsonView(Views.Public.class)
    String pluginName;

    @JsonView(Views.Public.class)
    String workspaceId;

    @JsonView(Views.Public.class)
    String templateName;

    @JsonView(Views.Public.class)
    DatasourceConfiguration datasourceConfiguration;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonView(Views.Public.class)
    Set<String> invalids;

    /*
     * - To return useful hints to the user.
     * - These messages are generated by the API server based on the other datasource attributes.
     */
    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonView(Views.Public.class)
    Set<String> messages;


    /*
     * This field is introduced as part of git sync feature, for the git import we will need to identify the datasource's
     * which are not configured. This way user can configure those datasource, which may have been introduced as part of git import.
     */
    @JsonView(Views.Public.class)
    Boolean isConfigured;

    @Transient
    @JsonView(Views.Public.class)
    Boolean isRecentlyCreated;

    /*
     * This field is meant to indicate whether the datasource is part of a template, or a copy of the same.
     * The field is not used anywhere in the codebase because templates are created directly in the DB, and the field
     * serves only as a DTO property.
     */
    @JsonView(Views.Public.class)
    Boolean isTemplate;

    /*
     * This field is meant to indicate whether the datasource is part of a mock DB, or a copy of the same.
     * The field is set during the creation of the mock db
     */
    @JsonView(Views.Public.class)
    Boolean isMock;

    @JsonView(Views.Public.class)
    private boolean isValid;

    public Datasource convertToDatasource() {
        Datasource datasource = new Datasource();
        datasource.setId(this.id);
        datasource.setName(this.name);
        datasource.setPluginId(this.pluginId);
        datasource.setPluginName(this.pluginName);
        datasource.setWorkspaceId(this.workspaceId);

        datasource.setIsTemplate(this.isTemplate);
        datasource.setTemplateName(this.templateName);
        datasource.setIsConfigured(this.isConfigured);
        datasource.setIsRecentlyCreated(this.isRecentlyCreated);
        datasource.setIsMock(this.isMock);

        datasource.setDatasourceStorage(new DatasourceStorage(id, null, datasourceConfiguration,  null, null));
        return datasource;
    }

    public static DatasourceDTO createDatasourceDTO(Datasource datasource) {
        DatasourceDTO datasourceDTO = new DatasourceDTO();
        datasourceDTO.setId(datasource.getId());
        datasourceDTO.setUserPermissions(datasource.getUserPermissions());
        datasourceDTO.setName(datasource.getName());
        datasourceDTO.setPluginId(datasource.getPluginId());
        datasourceDTO.setPluginName(datasource.getPluginName());
        datasourceDTO.setWorkspaceId(datasource.getWorkspaceId());

        datasourceDTO.setIsTemplate(datasource.getIsTemplate());
        datasourceDTO.setTemplateName(datasource.getTemplateName());
        datasourceDTO.setIsConfigured(datasource.getIsConfigured());
        datasourceDTO.setIsRecentlyCreated(datasource.getIsRecentlyCreated());
        datasourceDTO.setIsMock(datasource.getIsMock());
        datasourceDTO.setValid(datasource.getIsValid());

        datasourceDTO.setDatasourceConfiguration(datasource.getDatasourceStorage().getDatasourceConfiguration());
        datasourceDTO.setInvalids(datasource.getDatasourceStorage().getInvalids());
        datasourceDTO.setMessages(datasource.getDatasourceStorage().getMessages());

        return datasourceDTO;
    }

}
