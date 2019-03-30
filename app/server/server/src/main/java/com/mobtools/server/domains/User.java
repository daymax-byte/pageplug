package com.mobtools.server.domains;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;


@Getter
@Setter
@ToString
@NoArgsConstructor
@Document
public class User extends BaseDomain {

    private String name;

    private String email;

    private Set<Role> roles;

    private String password;
}
