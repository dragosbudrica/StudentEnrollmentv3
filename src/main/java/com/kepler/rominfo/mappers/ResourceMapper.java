package com.kepler.rominfo.mappers;

import com.kepler.rominfo.model.Resource;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceMapper {
    Resource getResourceByName(@Param("resourceName") String resourceName);
}
