package com.kepler.rominfo.mappers;

import com.kepler.rominfo.model.Role;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleMapper {
    Role getRoleByName(@Param("roleName") String roleName);
}
