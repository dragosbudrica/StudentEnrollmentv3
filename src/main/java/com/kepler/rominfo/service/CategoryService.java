package com.kepler.rominfo.service;

import com.kepler.rominfo.mappers.CategoryMapper;
import com.kepler.rominfo.model.Category;
import com.kepler.rominfo.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private CategoryMapper categoryMapper;

    @Autowired
    public CategoryService(CategoryMapper categoryMapper) { this.categoryMapper = categoryMapper; }

    public List<Category> getAllCategories() {
        return categoryMapper.getAllCategories();
    }
}
