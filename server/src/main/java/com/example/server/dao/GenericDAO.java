package com.example.server.dao;

import java.util.List;
import java.util.Optional;

public interface GenericDAO<T,ID> {

    boolean save (T t);

    boolean update (T t);

    boolean deleteById(ID id);

    Optional<T> findById(ID id);

    List<T> findAll();
}
