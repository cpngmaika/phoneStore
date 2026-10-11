# Project dump

Root: `C:\pj\phoneStore\server\src`

Generated: 2026-10-11 22:53:13.592525

# main\java\com\example\server\config\JPAConfig.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\config\JPAConfig.java` |
| Size | 2166 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 19:21:22.011000 |

```java
package com.example.server.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class JPAConfig {

    private static final EntityManagerFactory emf;

    static {
        Map<String, String> properties = new HashMap<>();

        try (InputStream input =
                     JPAConfig.class.getClassLoader()
                             .getResourceAsStream("db.properties")) {

            if (input != null) {
                Properties prop = new Properties();
                prop.load(input);

                properties.put(
                        "jakarta.persistence.jdbc.url",
                        prop.getProperty("db.url")
                );

                properties.put(
                        "jakarta.persistence.jdbc.user",
                        prop.getProperty("db.user")
                );

                properties.put(
                        "jakarta.persistence.jdbc.password",
                        prop.getProperty("db.password")
                );

                properties.put(
                        "jakarta.persistence.jdbc.driver",
                        prop.getProperty("db.driver")
                );
            }

            emf = Persistence.createEntityManagerFactory(
                    "PhoneStorePU",
                    properties
            );

        } catch (Exception ex) {
            System.err.println(
                    "Lỗi khởi tạo EntityManagerFactory: "
                            + ex.getMessage()
            );

            throw new ExceptionInInitializerError(ex);
        }
    }

    public static EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    public static void shutdown() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}
```

# main\java\com\example\server\config\MailConfig.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\config\MailConfig.java` |
| Size | 68 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:25:31.229000 |

```java
package com.example.server.config;

public class MailConfig {
}

```

# main\java\com\example\server\config\VNPayConfig.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\config\VNPayConfig.java` |
| Size | 69 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:25:21.677000 |

```java
package com.example.server.config;

public class VNPayConfig {
}

```

# main\java\com\example\server\controller\AuthServlet.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\controller\AuthServlet.java` |
| Size | 3238 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.403056 |

```java
package com.example.server.controller;

import com.example.server.dto.auth.LoginRequest;
import com.example.server.dto.auth.RegisterRequest;
import com.example.server.dto.common.ApiResponse;
import com.example.server.model.User;
import com.example.server.service.AuthService;
import com.example.server.util.JsonUtil;
import com.example.server.util.SessionUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {
    private final AuthService authService = new AuthService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        if (path == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }

        try {
            switch (path) {
                case "/register":
                    RegisterRequest registerReq = JsonUtil.toObject(req, RegisterRequest.class);
                    User newUser = authService.register(registerReq);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, ApiResponse.ok("Registration Successfully", newUser));
                    break;
                case "/login":
                    LoginRequest loginReq = JsonUtil.toObject(req, LoginRequest.class);
                    User user = authService.login(loginReq);
                    SessionUtil.setLoggedInUser(req, user);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Login Successfully", user));
                    break;
                case "/logout":
                    SessionUtil.clearSession(req);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Logout Successfully", null));
                    break;
                default:
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
                    break;
            }
        } catch (Exception e) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        if ("/me".equals(path)) {
            User currentUser = SessionUtil.getLoggedInUser(req);
            if (currentUser != null) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Login Success", currentUser));
            } else {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Not logged in"));
            }
        } else {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
    }
}

```

# main\java\com\example\server\controller\CartServlet.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\controller\CartServlet.java` |
| Size | 73 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:26:00.755000 |

```java
package com.example.server.controller;

public class CartServlet {
}

```

# main\java\com\example\server\controller\LoginServlet.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\controller\LoginServlet.java` |
| Size | 74 bytes |
| Extension | `.java` |
| Modified | 2026-10-05 09:18:45.025000 |

```java
package com.example.server.controller;

public class LoginServlet {
}

```

# main\java\com\example\server\controller\OrderServlet.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\controller\OrderServlet.java` |
| Size | 74 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:26:09.061000 |

```java
package com.example.server.controller;

public class OrderServlet {
}

```

# main\java\com\example\server\controller\PaymentServlet.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\controller\PaymentServlet.java` |
| Size | 76 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:26:17.484000 |

```java
package com.example.server.controller;

public class PaymentServlet {
}

```

# main\java\com\example\server\controller\ProductServlet.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\controller\ProductServlet.java` |
| Size | 4781 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 20:37:21.235000 |

```java
package com.example.server.controller;

import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.product.ProductCreateRequest;
import com.example.server.dto.product.ProductResponse;
import com.example.server.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/products/*")
public class ProductServlet extends HttpServlet {
    private final ProductService productService = new ProductService();
    private final ObjectMapper objectMapper;

    public ProductServlet() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                List<ProductResponse> products = productService.getAllProducts();
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(products)));
            } else {
                Long id = Long.parseLong(pathInfo.substring(1));
                ProductResponse product = productService.getProductById(id);
                resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success(product)));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        try {
            ProductCreateRequest request = objectMapper.readValue(req.getReader(), ProductCreateRequest.class);
            ProductResponse created = productService.createProduct(request);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Tạo sản phẩm thành công", created)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();
        try {
            if (pathInfo == null || pathInfo.length() <= 1) {
                throw new IllegalArgumentException("Thiếu ID sản phẩm cần cập nhật");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            ProductCreateRequest request = objectMapper.readValue(req.getReader(), ProductCreateRequest.class);
            ProductResponse updated = productService.updateProduct(id, request);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Cập nhật thành công", updated)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");
        String pathInfo = req.getPathInfo();
        try {
            if (pathInfo == null || pathInfo.length() <= 1) {
                throw new IllegalArgumentException("Thiếu ID sản phẩm cần xoá");
            }
            Long id = Long.parseLong(pathInfo.substring(1));
            productService.deleteProduct(id);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.success("Xoá sản phẩm thành công", null)));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(e.getMessage())));
        }
    }
}
```

# main\java\com\example\server\controller\UserServlet.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\controller\UserServlet.java` |
| Size | 8754 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.403056 |

```java
package com.example.server.controller;

import com.example.server.dto.auth.ChangePasswordRequest;
import com.example.server.dto.common.ApiResponse;
import com.example.server.dto.user.AddressRequest;
import com.example.server.dto.user.UpdateProfileRequest;
import com.example.server.model.Address;
import com.example.server.model.User;
import com.example.server.service.UserService;
import com.example.server.util.JsonUtil;
import com.example.server.util.SessionUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/user/*", "/api/users/*"})
public class UserServlet extends HttpServlet {
    private final UserService userService = new UserService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        if (path == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }

        User currentUser = SessionUtil.getLoggedInUser(req);
        if (currentUser == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        if ("/profile".equals(path)) {
            try {
                User user = userService.getProfile(currentUser.getId());
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Get profile successfully", user));
            } catch (Exception e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
            }
        } else if ("/addresses".equals(path)) {
            try {
                List<Address> addresses = userService.getAddresses(currentUser.getId());
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Get addresses successfully", addresses));
            } catch (Exception e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
            }
        } else {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        if (path == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
            return;
        }

        User currentUser = SessionUtil.getLoggedInUser(req);
        if (currentUser == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        switch (path) {
            case "/profile":
                try {
                    UpdateProfileRequest updateReq = JsonUtil.toObject(req, UpdateProfileRequest.class);
                    User updatedUser = userService.updateProfile(currentUser.getId(), updateReq);
                    SessionUtil.setLoggedInUser(req, updatedUser);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Update profile successfully", updatedUser));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/change-password":
                try {
                    ChangePasswordRequest passReq = JsonUtil.toObject(req, ChangePasswordRequest.class);
                    boolean isPassChanged = userService.changePassword(currentUser.getId(), passReq);
                    if (isPassChanged) {
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Change password successfully", null));
                    }
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/addresses":
                try {
                    AddressRequest addrReq = JsonUtil.toObject(req, AddressRequest.class);
                    Address newAddress = userService.addAddress(currentUser.getId(), addrReq);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, ApiResponse.ok("Address added successfully", newAddress));
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            case "/addresses/delete":
                try {
                    String idParam = req.getParameter("id");
                    if (idParam == null) {
                        JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing address id parameter"));
                        break;
                    }
                    Long addressId = Long.parseLong(idParam);
                    userService.deleteAddress(currentUser.getId(), addressId);
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Address deleted successfully", null));
                } catch (IllegalArgumentException e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
                } catch (Exception e) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
                }
                break;

            default:
                JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
                break;
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        User currentUser = SessionUtil.getLoggedInUser(req);
        if (currentUser == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        // Support DELETE /addresses/{id} or /addresses?id={id}
        if (path != null && path.startsWith("/addresses")) {
            try {
                Long addressId = null;
                if (path.length() > "/addresses/".length()) {
                    addressId = Long.parseLong(path.substring("/addresses/".length()));
                } else {
                    String idParam = req.getParameter("id");
                    if (idParam != null) {
                        addressId = Long.parseLong(idParam);
                    }
                }

                if (addressId == null) {
                    JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing address id"));
                    return;
                }

                userService.deleteAddress(currentUser.getId(), addressId);
                JsonUtil.sendJson(resp, HttpServletResponse.SC_OK, ApiResponse.ok("Address deleted successfully", null));
            } catch (IllegalArgumentException e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error(e.getMessage()));
            } catch (Exception e) {
                JsonUtil.sendJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error(e.getMessage()));
            }
        } else {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
    }
}

```

# main\java\com\example\server\dao\AddressDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\AddressDao.java` |
| Size | 727 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.404054 |

```java
package com.example.server.dao;

import com.example.server.model.Address;
import jakarta.persistence.EntityManager;

import java.util.List;

public class AddressDao extends BaseDao<Address, Long> {

    public AddressDao() {
        super(Address.class);
    }

    public List<Address> findByUserId(Long userId) {
        if (userId == null) {
            return List.of();
        }
        EntityManager em = getEntityManager();
        try {
            return em.createQuery("SELECT a FROM Address a WHERE a.user.id = :userId", Address.class)
                    .setParameter("userId", userId)
                    .getResultList();
        } finally {
            em.close();
        }
    }
}

```

# main\java\com\example\server\dao\BaseDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\BaseDao.java` |
| Size | 3294 bytes |
| Extension | `.java` |
| Modified | 2026-10-10 21:20:17.152000 |

```java
package com.example.server.dao;

import com.example.server.config.JPAConfig;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public abstract class BaseDao<T, ID> implements GenericDao<T, ID> {

    private final Class<T> entityClass;

    protected BaseDao(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    protected EntityManager getEntityManager() {
        return JPAConfig.getEntityManager();
    }

    @Override
    public T findById(ID id) {
        if (id == null) {
            return null;
        }
        EntityManager em = getEntityManager();
        try {
            return em.find(entityClass, id);
        } finally {
            em.close();
        }
    }

    public Optional<T> findOptionalById(ID id) {
        return Optional.ofNullable(findById(id));
    }

    @Override
    public List<T> findAll() {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT e FROM " + entityClass.getSimpleName() + " e";
            return em.createQuery(jpql, entityClass).getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public T save(T entity) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            em.persist(entity);
            tx.commit();
            return entity;
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public T update(T entity) {
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            T merged = em.merge(entity);
            tx.commit();
            return merged;
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    @Override
    public void delete(T entity) {
        if (entity == null) {
            return;
        }
        EntityManager em = getEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            T merged = em.contains(entity) ? entity : em.merge(entity);
            em.remove(merged);
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    public boolean deleteById(ID id) {
        T entity = findById(id);
        if (entity != null) {
            delete(entity);
            return true;
        }
        return false;
    }

    public long count() {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT COUNT(e) FROM " + entityClass.getSimpleName() + " e";
            TypedQuery<Long> query = em.createQuery(jpql, Long.class);
            return query.getSingleResult();
        } finally {
            em.close();
        }
    }
}

```

# main\java\com\example\server\dao\BrandDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\BrandDao.java` |
| Size | 241 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:19:32.822000 |

```java
package com.example.server.dao;

import com.example.server.model.Brand;
import java.util.Optional;

public interface BrandDao extends GenericDao<Brand, Long> {
    Optional<Brand> findOptionalById(Long id);
    boolean deleteById(Long id);
}
```

# main\java\com\example\server\dao\CartDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\CartDao.java` |
| Size | 304 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:39:42.070576 |

```java
package com.example.server.dao;

import com.example.server.model.Cart;

import java.util.Optional;

public class CartDao extends BaseDao<Cart, Long> {

    public CartDao() {
        super(Cart.class);
    }

    public Optional<Cart> findByUserId(Long userId) {
        return Optional.empty();
    }
}

```

# main\java\com\example\server\dao\CartItemDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\CartItemDao.java` |
| Size | 263 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 14:59:21.684140 |

```java
package com.example.server.dao;

import com.example.server.model.CartItem;
import com.example.server.model.CartItemId;

public class CartItemDao extends BaseDao<CartItem, CartItemId> {

    public CartItemDao() {
        super(CartItem.class);
    }
}

```

# main\java\com\example\server\dao\CouponDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\CouponDao.java` |
| Size | 314 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:39:42.076202 |

```java
package com.example.server.dao;

import com.example.server.model.Coupon;

import java.util.Optional;

public class CouponDao extends BaseDao<Coupon, Long> {

    public CouponDao() {
        super(Coupon.class);
    }

    public Optional<Coupon> findByCode(String code) {
        return Optional.empty();
    }
}

```

# main\java\com\example\server\dao\GenericDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\GenericDao.java` |
| Size | 234 bytes |
| Extension | `.java` |
| Modified | 2026-10-10 21:20:17.109000 |

```java
package com.example.server.dao;

import java.util.List;

public interface GenericDao<T, ID> {

    T findById(ID id);

    List<T> findAll();

    T save(T entity);

    T update(T entity);

    void delete(T entity);
}
```

# main\java\com\example\server\dao\impl\BrandDaoImpl.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\impl\BrandDaoImpl.java` |
| Size | 574 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:19:53.970000 |

```java
package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.BrandDao;
import com.example.server.model.Brand;

import java.util.Optional;

public class BrandDaoImpl extends BaseDao<Brand, Long> implements BrandDao {

    public BrandDaoImpl() {
        super(Brand.class);
    }

    @Override
    public Optional<Brand> findOptionalById(Long id) {
        return Optional.ofNullable(findById(id));
    }

    @Override
    public boolean deleteById(Long id) {
        return super.deleteById(id);
    }
}
```

# main\java\com\example\server\dao\impl\OrderDaoImpl.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\impl\OrderDaoImpl.java` |
| Size | 72 bytes |
| Extension | `.java` |
| Modified | 2026-10-10 21:23:21.033000 |

```java
package com.example.server.dao.impl;

public class OrderDaoImpl {
}

```

# main\java\com\example\server\dao\impl\PaymentDaoImpl.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\impl\PaymentDaoImpl.java` |
| Size | 74 bytes |
| Extension | `.java` |
| Modified | 2026-10-10 21:23:21.021000 |

```java
package com.example.server.dao.impl;

public class PaymentDaoImpl {
}

```

# main\java\com\example\server\dao\impl\ProductDaoImpl.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\impl\ProductDaoImpl.java` |
| Size | 5897 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 22:52:37.901498 |

```java
package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.ProductDao;
import com.example.server.model.Product;
import com.example.server.model.enums.Category;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public class ProductDaoImpl extends BaseDao<Product, Long> implements ProductDao {
    private static final String PRODUCT_DETAILS_FROM =
            " FROM Product p JOIN FETCH p.brand LEFT JOIN FETCH p.images";

    public ProductDaoImpl() {
        super(Product.class);
    }

    @Override
    public List<Product> findAll() {
        EntityManager em = getEntityManager();
        try {
            return em.createQuery(
                    "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM,
                    Product.class
            ).getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public Optional<Product> findOptionalById(Long id) {
        if (id == null) {
            return Optional.empty();
        }

        EntityManager em = getEntityManager();
        try {
            Product product = em.createQuery(
                            "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM + " WHERE p.id = :id",
                            Product.class
                    )
                    .setParameter("id", id)
                    .getSingleResult();
            return Optional.of(product);
        } catch (NoResultException e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }

    @Override
    public Optional<Product> findBySku(String sku) {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM + " WHERE p.sku = :sku";
            TypedQuery<Product> query = em.createQuery(jpql, Product.class);
            query.setParameter("sku", sku);
            return Optional.of(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }

    @Override
    public List<Product> findByCategory(Category category) {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM + " WHERE p.category = :category";
            TypedQuery<Product> query = em.createQuery(jpql, Product.class);
            query.setParameter("category", category);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public List<Product> findByBrandId(Long brandId) {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT DISTINCT p" + PRODUCT_DETAILS_FROM + " WHERE p.brand.id = :brandId";
            TypedQuery<Product> query = em.createQuery(jpql, Product.class);
            query.setParameter("brandId", brandId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public List<Product> search(String keyword, Category category, Long brandId, BigDecimal minPrice, BigDecimal maxPrice) {
        EntityManager em = getEntityManager();
        try {
            StringBuilder jpql = new StringBuilder("SELECT DISTINCT p")
                    .append(PRODUCT_DETAILS_FROM)
                    .append(" WHERE 1=1");

            if (keyword != null && !keyword.trim().isEmpty()) {
                jpql.append(" AND (LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.sku) LIKE LOWER(:keyword))");
            }
            if (category != null) {
                jpql.append(" AND p.category = :category");
            }
            if (brandId != null) {
                jpql.append(" AND p.brand.id = :brandId");
            }
            if (minPrice != null) {
                jpql.append(" AND p.price >= :minPrice");
            }
            if (maxPrice != null) {
                jpql.append(" AND p.price <= :maxPrice");
            }

            TypedQuery<Product> query = em.createQuery(jpql.toString(), Product.class);

            if (keyword != null && !keyword.trim().isEmpty()) {
                query.setParameter("keyword", "%" + keyword.trim() + "%");
            }
            if (category != null) {
                query.setParameter("category", category);
            }
            if (brandId != null) {
                query.setParameter("brandId", brandId);
            }
            if (minPrice != null) {
                query.setParameter("minPrice", minPrice);
            }
            if (maxPrice != null) {
                query.setParameter("maxPrice", maxPrice);
            }

            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public boolean hasReferences(Long productId) {
        EntityManager em = getEntityManager();
        try {
            return hasReference(em, "OrderItem", productId)
                    || hasReference(em, "CartItem", productId)
                    || hasReference(em, "ProductReview", productId);
        } finally {
            em.close();
        }
    }

    private boolean hasReference(EntityManager em, String entityName, Long productId) {
        Long count = em.createQuery(
                        "SELECT COUNT(e) FROM " + entityName + " e WHERE e.product.id = :productId",
                        Long.class
                )
                .setParameter("productId", productId)
                .getSingleResult();
        return count > 0;
    }
}
```

# main\java\com\example\server\dao\impl\ProductReviewDaoImpl.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\impl\ProductReviewDaoImpl.java` |
| Size | 1237 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:20:25.374000 |

```java
package com.example.server.dao.impl;

import com.example.server.dao.BaseDao;
import com.example.server.dao.ProductReviewDao;
import com.example.server.model.ProductReview;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public class ProductReviewDaoImpl extends BaseDao<ProductReview, Long> implements ProductReviewDao {

    public ProductReviewDaoImpl() {
        super(ProductReview.class);
    }

    @Override
    public Optional<ProductReview> findOptionalById(Long id) {
        return Optional.ofNullable(findById(id));
    }

    @Override
    public List<ProductReview> findByProductId(Long productId) {
        EntityManager em = getEntityManager();
        try {
            String jpql = "SELECT r FROM ProductReview r WHERE r.product.id = :productId";
            TypedQuery<ProductReview> query = em.createQuery(jpql, ProductReview.class);
            query.setParameter("productId", productId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    @Override
    public boolean deleteById(Long id) {
        return super.deleteById(id);
    }
}
```

# main\java\com\example\server\dao\impl\UserDaoImpl.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\impl\UserDaoImpl.java` |
| Size | 123 bytes |
| Extension | `.java` |
| Modified | 2026-10-10 21:23:21.010000 |

```java
package com.example.server.dao.impl;

import com.example.server.dao.UserDao;

public class UserDaoImpl extends UserDao {
}

```

# main\java\com\example\server\dao\OrderDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\OrderDao.java` |
| Size | 425 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:39:42.076202 |

```java
package com.example.server.dao;

import com.example.server.model.Order;

import java.util.List;
import java.util.Optional;

public class OrderDao extends BaseDao<Order, Long> {

    public OrderDao() {
        super(Order.class);
    }

    public List<Order> findByUserId(Long userId) {
        return List.of();
    }

    public Optional<Order> findByOrderCode(String orderCode) {
        return Optional.empty();
    }
}

```

# main\java\com\example\server\dao\OrderItemDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\OrderItemDao.java` |
| Size | 270 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 14:59:21.700622 |

```java
package com.example.server.dao;

import com.example.server.model.OrderItem;
import com.example.server.model.OrderItemId;

public class OrderItemDao extends BaseDao<OrderItem, OrderItemId> {

    public OrderItemDao() {
        super(OrderItem.class);
    }
}

```

# main\java\com\example\server\dao\PaymentDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\PaymentDao.java` |
| Size | 324 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:39:42.083057 |

```java
package com.example.server.dao;

import com.example.server.model.Payment;

import java.util.Optional;

public class PaymentDao extends BaseDao<Payment, Long> {

    public PaymentDao() {
        super(Payment.class);
    }

    public Optional<Payment> findByOrderId(Long orderId) {
        return Optional.empty();
    }
}

```

# main\java\com\example\server\dao\ProductDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\ProductDao.java` |
| Size | 655 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 22:52:37.859640 |

```java
package com.example.server.dao;

import com.example.server.model.Product;
import com.example.server.model.enums.Category;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductDao extends GenericDao<Product, Long> {
    Optional<Product> findOptionalById(Long id);
    Optional<Product> findBySku(String sku);
    List<Product> findByCategory(Category category);
    List<Product> findByBrandId(Long brandId);
    List<Product> search(String keyword, Category category, Long brandId, BigDecimal minPrice, BigDecimal maxPrice);
    boolean hasReferences(Long productId);
    boolean deleteById(Long id);
}
```

# main\java\com\example\server\dao\ProductReviewDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\ProductReviewDao.java` |
| Size | 353 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:20:09.004000 |

```java
package com.example.server.dao;

import com.example.server.model.ProductReview;
import java.util.List;
import java.util.Optional;

public interface ProductReviewDao extends GenericDao<ProductReview, Long> {
    Optional<ProductReview> findOptionalById(Long id);
    List<ProductReview> findByProductId(Long productId);
    boolean deleteById(Long id);
}
```

# main\java\com\example\server\dao\UserDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\UserDao.java` |
| Size | 1536 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:39:42.089424 |

```java
package com.example.server.dao;

import com.example.server.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.util.Optional;

public class UserDao extends BaseDao<User, Long> {

    public UserDao() {
        super(User.class);
    }

    public Optional<User> findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        EntityManager em = getEntityManager();
        try {
            TypedQuery<User> query = em.createQuery(
                    "SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)",
                    User.class
            );
            query.setParameter("email", email.trim());
            return Optional.of(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }

    public boolean existsByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        EntityManager em = getEntityManager();
        try {
            TypedQuery<Long> query = em.createQuery(
                    "SELECT COUNT(u) FROM User u WHERE LOWER(u.email) = LOWER(:email)",
                    Long.class
            );
            query.setParameter("email", email.trim());
            return query.getSingleResult() > 0;
        } finally {
            em.close();
        }
    }
}

```

# main\java\com\example\server\dao\WarrantyPolicyDao.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dao\WarrantyPolicyDao.java` |
| Size | 232 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:39:42.091472 |

```java
package com.example.server.dao;

import com.example.server.model.WarrantyPolicy;

public class WarrantyPolicyDao extends BaseDao<WarrantyPolicy, Long> {

    public WarrantyPolicyDao() {
        super(WarrantyPolicy.class);
    }
}

```

# main\java\com\example\server\dto\auth\ChangePasswordRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\auth\ChangePasswordRequest.java` |
| Size | 529 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:32:27.029047 |

```java
package com.example.server.dto.auth;

public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;

    public ChangePasswordRequest() {
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

```

# main\java\com\example\server\dto\auth\LoginRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\auth\LoginRequest.java` |
| Size | 574 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:22:37.810258 |

```java
package com.example.server.dto.auth;

public class LoginRequest {
    private String email;
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

```

# main\java\com\example\server\dto\auth\LoginResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\auth\LoginResponse.java` |
| Size | 631 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:22:44.335969 |

```java
package com.example.server.dto.auth;

import com.example.server.dto.user.UserResponse;

public class LoginResponse {
    private String message;
    private UserResponse user;

    public LoginResponse() {
    }

    public LoginResponse(String message, UserResponse user) {
        this.message = message;
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}

```

# main\java\com\example\server\dto\auth\RegisterRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\auth\RegisterRequest.java` |
| Size | 799 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:32:20.703202 |

```java
package com.example.server.dto.auth;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;

    public RegisterRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}

```

# main\java\com\example\server\dto\brand\BrandResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\brand\BrandResponse.java` |
| Size | 776 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:33:12.280096 |

```java
package com.example.server.dto.brand;

public class BrandResponse {
    private Long id;
    private String name;
    private String logoUrl;
    private String description;

    public BrandResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

```

# main\java\com\example\server\dto\cart\CartItemRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\cart\CartItemRequest.java` |
| Size | 429 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:34:27.033478 |

```java
package com.example.server.dto.cart;

public class CartItemRequest {
    private Long productId;
    private Integer quantity;

    public CartItemRequest() {
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}

```

# main\java\com\example\server\dto\cart\CartItemResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\cart\CartItemResponse.java` |
| Size | 1194 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:34:42.921657 |

```java
package com.example.server.dto.cart;

import java.math.BigDecimal;

public class CartItemResponse {
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;

    public CartItemResponse() {
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}

```

# main\java\com\example\server\dto\cart\CartResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\cart\CartResponse.java` |
| Size | 670 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:34:34.263093 |

```java
package com.example.server.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;

    public CartResponse() {
    }

    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }

    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}

```

# main\java\com\example\server\dto\common\ApiResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\common\ApiResponse.java` |
| Size | 1323 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.404054 |

```java
package com.example.server.dto.common;

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public ApiResponse() {
    }

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Success", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}

```

# main\java\com\example\server\dto\coupon\CouponResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\coupon\CouponResponse.java` |
| Size | 1801 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:35:31.473838 |

```java
package com.example.server.dto.coupon;

import com.example.server.model.enums.CouponType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CouponResponse {
    private Long id;
    private String code;
    private CouponType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;

    public CouponResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public CouponType getDiscountType() { return discountType; }
    public void setDiscountType(CouponType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}

```

# main\java\com\example\server\dto\coupon\CouponValidateRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\coupon\CouponValidateRequest.java` |
| Size | 253 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:35:39.436584 |

```java
package com.example.server.dto.coupon;

public class CouponValidateRequest {
    private String code;

    public CouponValidateRequest() {
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}

```

# main\java\com\example\server\dto\order\OrderCreateRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\order\OrderCreateRequest.java` |
| Size | 905 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:34:50.623611 |

```java
package com.example.server.dto.order;

import java.util.List;

public class OrderCreateRequest {
    private Long shippingAddressId;
    private String couponCode;
    private List<OrderItemRequest> items;
    private String paymentMethod;

    public OrderCreateRequest() {
    }

    public Long getShippingAddressId() { return shippingAddressId; }
    public void setShippingAddressId(Long shippingAddressId) { this.shippingAddressId = shippingAddressId; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}

```

# main\java\com\example\server\dto\order\OrderItemRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\order\OrderItemRequest.java` |
| Size | 432 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:34:57.116144 |

```java
package com.example.server.dto.order;

public class OrderItemRequest {
    private Long productId;
    private Integer quantity;

    public OrderItemRequest() {
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}

```

# main\java\com\example\server\dto\order\OrderItemResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\order\OrderItemResponse.java` |
| Size | 990 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:35:13.478211 |

```java
package com.example.server.dto.order;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    public OrderItemResponse() {
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}

```

# main\java\com\example\server\dto\order\OrderResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\order\OrderResponse.java` |
| Size | 1594 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:35:05.937404 |

```java
package com.example.server.dto.order;

import com.example.server.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.util.List;

public class OrderResponse {
    private Long id;
    private String orderCode;
    private OrderStatus status;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private String couponCode;
    private List<OrderItemResponse> items;
    private String shippingAddress;

    public OrderResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
}

```

# main\java\com\example\server\dto\payment\PaymentResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\payment\PaymentResponse.java` |
| Size | 1187 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:35:21.697275 |

```java
package com.example.server.dto.payment;

import com.example.server.model.enums.PaymentMethod;
import com.example.server.model.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {
    private Long id;
    private Long orderId;
    private PaymentMethod method;
    private PaymentStatus status;
    private BigDecimal amount;
    private LocalDateTime paidAt;

    public PaymentResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
}

```

# main\java\com\example\server\dto\product\ProductCreateRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\product\ProductCreateRequest.java` |
| Size | 1779 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:06:37.880000 |

```java
package com.example.server.dto.product;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;

public class ProductCreateRequest {
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Category category;
    private ProductStatus status;
    private Long brandId;
    private Long warrantyPolicyId;
    private List<String> imageUrls; // Danh sách URL hình ảnh sản phẩm gửi từ FE

    public ProductCreateRequest() {
    }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }

    public Long getWarrantyPolicyId() { return warrantyPolicyId; }
    public void setWarrantyPolicyId(Long warrantyPolicyId) { this.warrantyPolicyId = warrantyPolicyId; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
```

# main\java\com\example\server\dto\product\ProductResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\product\ProductResponse.java` |
| Size | 1987 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:06:43.360000 |

```java
package com.example.server.dto.product;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;

public class ProductResponse {
    private Long id;
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Category category;
    private ProductStatus status;
    private Long brandId;
    private String brandName;
    private Long warrantyPolicyId;
    private List<String> imageUrls;

    public ProductResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public Long getWarrantyPolicyId() { return warrantyPolicyId; }
    public void setWarrantyPolicyId(Long warrantyPolicyId) { this.warrantyPolicyId = warrantyPolicyId; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
```

# main\java\com\example\server\dto\product\ProductSearchRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\product\ProductSearchRequest.java` |
| Size | 1000 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:06:49.130000 |

```java
package com.example.server.dto.product;

import com.example.server.model.enums.Category;

import java.math.BigDecimal;

public class ProductSearchRequest {
    private String keyword;
    private Category category;
    private Long brandId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    public ProductSearchRequest() {
    }

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Long getBrandId() { return brandId; }
    public void setBrandId(Long brandId) { this.brandId = brandId; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
}
```

# main\java\com\example\server\dto\review\ReviewCreateRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\review\ReviewCreateRequest.java` |
| Size | 651 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:33:21.259158 |

```java
package com.example.server.dto.review;

public class ReviewCreateRequest {
    private Long productId;
    private Integer rating;
    private String content;

    public ReviewCreateRequest() {
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

```

# main\java\com\example\server\dto\review\ReviewResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\review\ReviewResponse.java` |
| Size | 1023 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:34:20.632769 |

```java
package com.example.server.dto.review;

public class ReviewResponse {
    private Long id;
    private String reviewerName;
    private Long productId;
    private Integer rating;
    private String content;
    private Boolean isHidden;

    public ReviewResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getIsHidden() { return isHidden; }
    public void setIsHidden(Boolean isHidden) { this.isHidden = isHidden; }
}

```

# main\java\com\example\server\dto\user\AddressRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\user\AddressRequest.java` |
| Size | 1637 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:32:34.322531 |

```java
package com.example.server.dto.user;

public class AddressRequest {
    private String receiverName;
    private String receiverPhone;
    private String country;
    private String province;
    private String district;
    private String ward;
    private String streetDetail;
    private Boolean isDefault;

    public AddressRequest() {
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getStreetDetail() {
        return streetDetail;
    }

    public void setStreetDetail(String streetDetail) {
        this.streetDetail = streetDetail;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
}

```

# main\java\com\example\server\dto\user\AddressResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\user\AddressResponse.java` |
| Size | 1774 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:32:41.419415 |

```java
package com.example.server.dto.user;

public class AddressResponse {
    private Long id;
    private String receiverName;
    private String receiverPhone;
    private String country;
    private String province;
    private String district;
    private String ward;
    private String streetDetail;
    private Boolean isDefault;

    public AddressResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getStreetDetail() {
        return streetDetail;
    }

    public void setStreetDetail(String streetDetail) {
        this.streetDetail = streetDetail;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
}

```

# main\java\com\example\server\dto\user\UpdateProfileRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\user\UpdateProfileRequest.java` |
| Size | 882 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.405054 |

```java
package com.example.server.dto.user;

public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String avatarUrl;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String fullName, String phone, String avatarUrl) {
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}

```

# main\java\com\example\server\dto\user\UserCreateRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\user\UserCreateRequest.java` |
| Size | 1502 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:22:51.583346 |

```java
package com.example.server.dto.user;

import com.example.server.model.enums.Role;

public class UserCreateRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String avatarUrl;
    private Role role;

    public UserCreateRequest() {
    }

    public UserCreateRequest(String fullName, String email, String password, String phone, String avatarUrl, Role role) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}

```

# main\java\com\example\server\dto\user\UserResponse.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\user\UserResponse.java` |
| Size | 2140 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:23:03.476714 |

```java
package com.example.server.dto.user;

import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;

public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private Role role;
    private UserStatus status;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullName, String email, String phone, String avatarUrl, Role role, UserStatus status) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.status = status;
    }

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getStatus()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}

```

# main\java\com\example\server\dto\user\UserUpdateRequest.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\dto\user\UserUpdateRequest.java` |
| Size | 1344 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:22:57.513928 |

```java
package com.example.server.dto.user;

import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;

public class UserUpdateRequest {
    private String fullName;
    private String phone;
    private String avatarUrl;
    private Role role;
    private UserStatus status;

    public UserUpdateRequest() {
    }

    public UserUpdateRequest(String fullName, String phone, String avatarUrl, Role role, UserStatus status) {
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.status = status;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}

```

# main\java\com\example\server\exception\AppException.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\exception\AppException.java` |
| Size | 171 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 20:45:53.429000 |

```java
package com.example.server.exception;

public class AppException extends RuntimeException {
    public AppException(String message) {
        super(message);
    }
}
```

# main\java\com\example\server\exception\AuthenticationException.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\exception\AuthenticationException.java` |
| Size | 84 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 19:52:54.066000 |

```java
package com.example.server.exception;

public class AuthenticationException {
}

```

# main\java\com\example\server\exception\AuthorizationException.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\exception\AuthorizationException.java` |
| Size | 83 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 19:52:45.218000 |

```java
package com.example.server.exception;

public class AuthorizationException {
}

```

# main\java\com\example\server\exception\DAOException.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\exception\DAOException.java` |
| Size | 73 bytes |
| Extension | `.java` |
| Modified | 2026-10-05 09:22:42.304000 |

```java
package com.example.server.exception;

public class DAOException {
}

```

# main\java\com\example\server\exception\PaymentException.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\exception\PaymentException.java` |
| Size | 77 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:27:50.374000 |

```java
package com.example.server.exception;

public class PaymentException {
}

```

# main\java\com\example\server\exception\ValidationException.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\exception\ValidationException.java` |
| Size | 80 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 19:53:01.465000 |

```java
package com.example.server.exception;

public class ValidationException {
}

```

# main\java\com\example\server\filter\AuthFilter.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\filter\AuthFilter.java` |
| Size | 1618 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.405054 |

```java
package com.example.server.filter;

import com.example.server.dto.common.ApiResponse;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.util.JsonUtil;
import com.example.server.util.SessionUtil;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter(urlPatterns = {"/api/user/*", "/api/users/*", "/api/admin/*"})
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        User currentUser = SessionUtil.getLoggedInUser(req);
        if (currentUser == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please login first"));
            return;
        }

        String uri = req.getRequestURI();
        if (uri.contains("/api/admin/") && currentUser.getRole() != Role.ADMIN) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN, ApiResponse.error("Access denied: Admin role required"));
            return;
        }

        chain.doFilter(request, response);
    }
}

```

# main\java\com\example\server\filter\CorsFilter.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\filter\CorsFilter.java` |
| Size | 1240 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 18:59:58.160000 |

```java
package com.example.server.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

        // Trả về 200 OK ngay lập tức cho Preflight Request (OPTIONS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(req, res);
    }
}
```

# main\java\com\example\server\model\Accessory.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Accessory.java` |
| Size | 1603 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:16:19.628000 |

```java
package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "accessories")
@Inheritance(strategy = InheritanceType.JOINED)
@PrimaryKeyJoinColumn(name = "product_id")
public abstract class Accessory extends Product {

    @Column(name = "compatible_with", length = 255)
    private String compatibleWith;

    @Column(name = "color", length = 100)
    private String color;

    protected Accessory() {
    }

    protected Accessory(
            String sku,
            String name,
            String description,
            BigDecimal price,
            Category category,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color
    ) {
        super(
                sku,
                name,
                description,
                price,
                category,
                status,
                brand,
                warrantyPolicy
        );

        this.compatibleWith = compatibleWith;
        this.color = color;
    }

    public String getCompatibleWith() {
        return compatibleWith;
    }

    public void setCompatibleWith(String compatibleWith) {
        this.compatibleWith = compatibleWith;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
```

# main\java\com\example\server\model\Address.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Address.java` |
| Size | 3528 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.406054 |

```java
package com.example.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_addresses_user")
    )
    private User user;

    @Column(name = "receiver_name", nullable = false, length = 150)
    private String receiverName;

    @Column(name = "receiver_phone", nullable = false, length = 30)
    private String receiverPhone;

    @Column(name = "country", nullable = false, length = 100)
    private String country;

    @Column(name = "province", nullable = false, length = 100)
    private String province;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Column(name = "ward", nullable = false, length = 100)
    private String ward;

    @Column(name = "street_detail", nullable = false, length = 255)
    private String streetDetail;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    protected Address() {
    }

    public Address(
            User user,
            String receiverName,
            String receiverPhone,
            String country,
            String province,
            String district,
            String ward,
            String streetDetail,
            Boolean isDefault
    ) {
        this.user = user;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.country = country;
        this.province = province;
        this.district = district;
        this.ward = ward;
        this.streetDetail = streetDetail;
        this.isDefault = isDefault;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getStreetDetail() {
        return streetDetail;
    }

    public void setStreetDetail(String streetDetail) {
        this.streetDetail = streetDetail;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
}
```

# main\java\com\example\server\model\Brand.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Brand.java` |
| Size | 1495 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:10:52.644000 |

```java
package com.example.server.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "brands")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "brand")
    private List<Product> products = new ArrayList<>();

    protected Brand() {
    }

    public Brand(
            String name,
            String logoUrl,
            String description
    ) {
        this.name = name;
        this.logoUrl = logoUrl;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Product> getProducts() {
        return products;
    }
}
```

# main\java\com\example\server\model\Cable.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Cable.java` |
| Size | 2298 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:16:53.386000 |

```java
package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cables")
@PrimaryKeyJoinColumn(name = "product_id")
public class Cable extends Accessory {

    @Column(name = "length_meters", nullable = false, precision = 6, scale = 2)
    private BigDecimal lengthMeters;

    @Column(name = "connection_type", nullable = false, length = 100)
    private String connectionType;

    @Column(name = "material", nullable = false, length = 100)
    private String material;

    protected Cable() {
    }

    public Cable(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color,
            BigDecimal lengthMeters,
            String connectionType,
            String material
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.CABLE,
                status,
                brand,
                warrantyPolicy,
                compatibleWith,
                color
        );

        this.lengthMeters = lengthMeters;
        this.connectionType = connectionType;
        this.material = material;
    }

    @Override
    public String getSpecifications() {
        return "Length: " + lengthMeters + "m"
                + ", Connection: " + connectionType
                + ", Material: " + material;
    }

    public BigDecimal getLengthMeters() {
        return lengthMeters;
    }

    public void setLengthMeters(BigDecimal lengthMeters) {
        this.lengthMeters = lengthMeters;
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }
}
```

# main\java\com\example\server\model\Cart.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Cart.java` |
| Size | 1526 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 14:59:21.445879 |

```java
package com.example.server.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_carts_user")
    )
    private User user;

    @OneToMany(
            mappedBy = "cart",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CartItem> items = new ArrayList<>();

    protected Cart() {
    }

    public Cart(User user) {
        this.user = user;
    }

    public BigDecimal getTotalAmount() {
        BigDecimal total = BigDecimal.ZERO;
        if (items != null) {
            for (CartItem item : items) {
                total = total.add(item.getSubtotal());
            }
        }
        return total;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }
}
```

# main\java\com\example\server\model\CartItem.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\CartItem.java` |
| Size | 1932 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 14:59:37.188295 |

```java
package com.example.server.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @EmbeddedId
    private CartItemId id = new CartItemId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("cartId")
    @JoinColumn(
            name = "cart_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_cart_items_cart")
    )
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("productId")
    @JoinColumn(
            name = "product_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_cart_items_product")
    )
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    protected CartItem() {
    }

    public CartItem(Product product, Integer quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        if (product != null && product.getPrice() != null && quantity != null) {
            return product.getPrice().multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }

    public CartItemId getId() {
        return id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
        this.id.setCartId(cart != null ? cart.getId() : null);
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
        this.id.setProductId(product != null ? product.getId() : null);
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
```

# main\java\com\example\server\model\CartItemId.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\CartItemId.java` |
| Size | 1079 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 14:59:37.189626 |

```java
package com.example.server.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CartItemId implements Serializable {

    private Long cartId;
    private Long productId;

    public CartItemId() {
    }

    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof CartItemId)) {
            return false;
        }

        CartItemId that = (CartItemId) o;

        return Objects.equals(cartId, that.cartId)
                && Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cartId, productId);
    }
}
```

# main\java\com\example\server\model\Case.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Case.java` |
| Size | 2268 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:17:08.764000 |

```java
package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cases")
@PrimaryKeyJoinColumn(name = "product_id")
public class Case extends Accessory {

    @Column(name = "material", nullable = false, length = 100)
    private String material;

    @Column(name = "supports_magsafe", nullable = false)
    private Boolean supportsMagSafe = false;

    @Column(name = "is_shockproof", nullable = false)
    private Boolean isShockproof = false;

    protected Case() {
    }

    public Case(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color,
            String material,
            Boolean supportsMagSafe,
            Boolean isShockproof
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.CASE,
                status,
                brand,
                warrantyPolicy,
                compatibleWith,
                color
        );

        this.material = material;
        this.supportsMagSafe = supportsMagSafe;
        this.isShockproof = isShockproof;
    }

    @Override
    public String getSpecifications() {
        return "Material: " + material
                + ", MagSafe: " + supportsMagSafe
                + ", Shockproof: " + isShockproof;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Boolean getSupportsMagSafe() {
        return supportsMagSafe;
    }

    public void setSupportsMagSafe(Boolean supportsMagSafe) {
        this.supportsMagSafe = supportsMagSafe;
    }

    public Boolean getIsShockproof() {
        return isShockproof;
    }

    public void setIsShockproof(Boolean isShockproof) {
        this.isShockproof = isShockproof;
    }
}
```

# main\java\com\example\server\model\Charger.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Charger.java` |
| Size | 2368 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:16:35.608000 |

```java
package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "chargers")
@PrimaryKeyJoinColumn(name = "product_id")
public class Charger extends Accessory {

    @Column(name = "wattage_w", nullable = false)
    private Integer wattageW;

    @Column(name = "number_of_ports", nullable = false)
    private Integer numberOfPorts;

    @Column(name = "connection_type", nullable = false, length = 100)
    private String connectionType;

    protected Charger() {
    }

    public Charger(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color,
            Integer wattageW,
            Integer numberOfPorts,
            String connectionType
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.CHARGER,
                status,
                brand,
                warrantyPolicy,
                compatibleWith,
                color
        );

        this.wattageW = wattageW;
        this.numberOfPorts = numberOfPorts;
        this.connectionType = connectionType;
    }

    public boolean isFastCharge() {
        return wattageW != null && wattageW >= 20;
    }

    @Override
    public String getSpecifications() {
        return "Power: " + wattageW + "W"
                + ", Ports: " + numberOfPorts
                + ", Connection: " + connectionType;
    }

    public Integer getWattageW() {
        return wattageW;
    }

    public void setWattageW(Integer wattageW) {
        this.wattageW = wattageW;
    }

    public Integer getNumberOfPorts() {
        return numberOfPorts;
    }

    public void setNumberOfPorts(Integer numberOfPorts) {
        this.numberOfPorts = numberOfPorts;
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }
}
```

# main\java\com\example\server\model\Coupon.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Coupon.java` |
| Size | 5419 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:56:46.087715 |

```java
package com.example.server.model;

import com.example.server.model.enums.CouponType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "coupons",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_coupons_code",
                        columnNames = "code"
                )
        }
)
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 20)
    private CouponType discountType;

    @Column(
            name = "discount_value",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal discountValue;

    @Column(
            name = "min_order_amount",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal minOrderAmount;

    @Column(
            name = "max_discount_amount",
            precision = 15,
            scale = 2
    )
    private BigDecimal maxDiscountAmount;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "usage_limit", nullable = false)
    private Integer usageLimit;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "coupon")
    private List<Order> orders = new ArrayList<>();

    protected Coupon() {
    }

    public Coupon(
            String code,
            CouponType discountType,
            BigDecimal discountValue,
            BigDecimal minOrderAmount,
            BigDecimal maxDiscountAmount,
            LocalDate startDate,
            LocalDate endDate,
            Integer usageLimit,
            Boolean isActive
    ) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrderAmount = minOrderAmount;
        this.maxDiscountAmount = maxDiscountAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.usageLimit = usageLimit;
        this.isActive = isActive;
    }

    public boolean isValid(BigDecimal orderAmount) {
        if (Boolean.FALSE.equals(isActive)) {
            return false;
        }
        LocalDate now = LocalDate.now();
        if (startDate != null && now.isBefore(startDate)) {
            return false;
        }
        if (endDate != null && now.isAfter(endDate)) {
            return false;
        }
        if (minOrderAmount != null && orderAmount != null && orderAmount.compareTo(minOrderAmount) < 0) {
            return false;
        }
        return true;
    }

    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (!isValid(orderAmount) || orderAmount == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (discountType == CouponType.PERCENTAGE) {
            discount = orderAmount.multiply(discountValue).divide(BigDecimal.valueOf(100));
            if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
                discount = maxDiscountAmount;
            }
        } else if (discountType == CouponType.FIXED_AMOUNT) {
            discount = discountValue;
        }

        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        return discount;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public CouponType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(CouponType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMinOrderAmount() {
        return minOrderAmount;
    }

    public void setMinOrderAmount(BigDecimal minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }

    public BigDecimal getMaxDiscountAmount() {
        return maxDiscountAmount;
    }

    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) {
        this.maxDiscountAmount = maxDiscountAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<Order> getOrders() {
        return orders;
    }
}
```

# main\java\com\example\server\model\Earphone.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Earphone.java` |
| Size | 2484 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:17:43.150000 |

```java
package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "earphones")
@PrimaryKeyJoinColumn(name = "product_id")
public class Earphone extends Accessory {

    @Column(name = "connection_type", nullable = false, length = 100)
    private String connectionType;

    @Column(name = "has_anc", nullable = false)
    private Boolean hasANC = false;

    @Column(name = "battery_life_hours", nullable = false, precision = 6, scale = 2)
    private BigDecimal batteryLifeHours;

    protected Earphone() {
    }

    public Earphone(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String compatibleWith,
            String color,
            String connectionType,
            Boolean hasANC,
            BigDecimal batteryLifeHours
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.EARPHONE,
                status,
                brand,
                warrantyPolicy,
                compatibleWith,
                color
        );

        this.connectionType = connectionType;
        this.hasANC = hasANC;
        this.batteryLifeHours = batteryLifeHours;
    }

    public boolean isWireless() {
        return connectionType != null
                && !connectionType.equalsIgnoreCase("WIRED");
    }

    @Override
    public String getSpecifications() {
        return "Connection: " + connectionType
                + ", ANC: " + hasANC
                + ", Battery: " + batteryLifeHours + " hours";
    }

    public String getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(String connectionType) {
        this.connectionType = connectionType;
    }

    public Boolean getHasANC() {
        return hasANC;
    }

    public void setHasANC(Boolean hasANC) {
        this.hasANC = hasANC;
    }

    public BigDecimal getBatteryLifeHours() {
        return batteryLifeHours;
    }

    public void setBatteryLifeHours(BigDecimal batteryLifeHours) {
        this.batteryLifeHours = batteryLifeHours;
    }
}
```

# main\java\com\example\server\model\enums\Category.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\enums\Category.java` |
| Size | 156 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:54:17.116923 |

```java
package com.example.server.model.enums;

public enum Category {
    SMARTPHONE,
    TABLET,
    ACCESSORY,
    CHARGER,
    CABLE,
    CASE,
    EARPHONE
}

```

# main\java\com\example\server\model\enums\CouponType.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\enums\CouponType.java` |
| Size | 105 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:41:17.394000 |

```java
package com.example.server.model.enums;

public enum CouponType {
    PERCENTAGE,
    FIXED_AMOUNT
}
```

# main\java\com\example\server\model\enums\OrderStatus.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\enums\OrderStatus.java` |
| Size | 155 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:54:51.875378 |

```java
package com.example.server.model.enums;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PROCESSING,
    SHIPPING,
    DELIVERED,
    CANCELLED
}
```

# main\java\com\example\server\model\enums\PaymentMethod.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\enums\PaymentMethod.java` |
| Size | 117 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:24:50.398000 |

```java
package com.example.server.model.enums;

public enum PaymentMethod {
    COD,
    BANK_TRANSFER,
    E_WALLET
}
```

# main\java\com\example\server\model\enums\PaymentStatus.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\enums\PaymentStatus.java` |
| Size | 128 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:40:42.826000 |

```java
package com.example.server.model.enums;

public enum PaymentStatus {
    PENDING,
    SUCCESS,
    FAILED,
    REFUNDED
}
```

# main\java\com\example\server\model\enums\ProductStatus.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\enums\ProductStatus.java` |
| Size | 120 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:54:35.770420 |

```java
package com.example.server.model.enums;

public enum ProductStatus {
    IN_STOCK,
    OUT_OF_STOCK,
    DISCONTINUED
}

```

# main\java\com\example\server\model\enums\Role.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\enums\Role.java` |
| Size | 102 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 17:37:29.437000 |

```java
package com.example.server.model.enums;

public enum Role {
    CUSTOMER,
    ADMIN,
    STAFF
}
```

# main\java\com\example\server\model\enums\UserStatus.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\enums\UserStatus.java` |
| Size | 110 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.407054 |

```java
package com.example.server.model.enums;

public enum UserStatus {
    ACTIVE,
    INACTIVE,
    LOCKED
}
```

# main\java\com\example\server\model\Order.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Order.java` |
| Size | 4680 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 14:59:21.468407 |

```java
package com.example.server.model;

import com.example.server.model.enums.OrderStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "orders",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_orders_order_code",
                        columnNames = "order_code"
                )
        }
)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code", nullable = false, length = 50)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_orders_user")
    )
    private User user;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "shipping_address_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_orders_shipping_address")
    )
    private Address shippingAddress;

    @Column(
            name = "shipping_fee",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private OrderStatus status = OrderStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "coupon_id",
            foreignKey = @ForeignKey(name = "fk_orders_coupon")
    )
    private Coupon coupon;

    @OneToOne(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Payment payment;

    protected Order() {
    }

    public Order(
            String orderCode,
            User user,
            Address shippingAddress
    ) {
        this.orderCode = orderCode;
        this.user = user;
        this.shippingAddress = shippingAddress;
        this.status = OrderStatus.PENDING;
        this.shippingFee = BigDecimal.ZERO;
    }

    public Boolean applyCoupon(Coupon coupon) {
        if (coupon == null) {
            return false;
        }

        this.coupon = coupon;
        return true;
    }

    public void confirm() {
        this.status = OrderStatus.CONFIRMED;
    }

    public void cancel() {
        this.status = OrderStatus.CANCELLED;
    }

    public BigDecimal calculateTotal() {
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItem item : items) {
            total = total.add(
                    item.getProduct()
                            .getPrice()
                            .multiply(
                                    BigDecimal.valueOf(item.getQuantity())
                            )
            );
        }

        return total.add(shippingFee);
    }

    public Long getId() {
        return id;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Coupon getCoupon() {
        return coupon;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }
}
```

# main\java\com\example\server\model\OrderItem.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\OrderItem.java` |
| Size | 1957 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 14:59:37.190630 |

```java
package com.example.server.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @EmbeddedId
    private OrderItemId id = new OrderItemId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("orderId")
    @JoinColumn(
            name = "order_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_order_items_order")
    )
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("productId")
    @JoinColumn(
            name = "product_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_order_items_product")
    )
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    protected OrderItem() {
    }

    public OrderItem(Product product, Integer quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        if (product != null && product.getPrice() != null && quantity != null) {
            return product.getPrice().multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }

    public OrderItemId getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
        this.id.setOrderId(order != null ? order.getId() : null);
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
        this.id.setProductId(product != null ? product.getId() : null);
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
```

# main\java\com\example\server\model\OrderItemId.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\OrderItemId.java` |
| Size | 1094 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 14:59:37.191630 |

```java
package com.example.server.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrderItemId implements Serializable {

    private Long orderId;
    private Long productId;

    public OrderItemId() {
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof OrderItemId)) {
            return false;
        }

        OrderItemId that = (OrderItemId) o;

        return Objects.equals(orderId, that.orderId)
                && Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, productId);
    }
}
```

# main\java\com\example\server\model\Payment.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Payment.java` |
| Size | 1911 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:22:20.265000 |

```java
package com.example.server.model;

import com.example.server.model.enums.PaymentMethod;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "order_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_payments_order")
    )
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false, length = 30)
    private PaymentMethod method;

    @Column(
            name = "amount",
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal amount;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    protected Payment() {
    }

    public Payment(
            Order order,
            PaymentMethod method,
            BigDecimal amount
    ) {
        this.order = order;
        this.method = method;
        this.amount = amount;
    }

    public void markAsPaid() {
        this.paidAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }
}
```

# main\java\com\example\server\model\Product.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Product.java` |
| Size | 4048 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:12:49.657000 |

```java
package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "products",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_products_sku",
                        columnNames = "sku"
                )
        }
)
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ProductStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "brand_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_products_brand")
    )
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "warranty_policy_id",
            foreignKey = @ForeignKey(name = "fk_products_warranty")
    )
    private WarrantyPolicy warrantyPolicy;

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<ProductReview> reviews = new ArrayList<>();

    protected Product() {
    }

    protected Product(
            String sku,
            String name,
            String description,
            BigDecimal price,
            Category category,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy
    ) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.status = status;
        this.brand = brand;
        this.warrantyPolicy = warrantyPolicy;
    }

    public abstract String getSpecifications();

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public WarrantyPolicy getWarrantyPolicy() {
        return warrantyPolicy;
    }

    public void setWarrantyPolicy(WarrantyPolicy warrantyPolicy) {
        this.warrantyPolicy = warrantyPolicy;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public List<ProductReview> getReviews() {
        return reviews;
    }
}
```

# main\java\com\example\server\model\ProductImage.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\ProductImage.java` |
| Size | 1833 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:18:43.220000 |

```java
package com.example.server.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "product_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_product_images_product")
    )
    private Product product;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    protected ProductImage() {
    }

    public ProductImage(
            Product product,
            String imageUrl,
            Boolean isPrimary,
            Integer sortOrder
    ) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.isPrimary = isPrimary;
        this.sortOrder = sortOrder;
    }

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
```

# main\java\com\example\server\model\ProductReview.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\ProductReview.java` |
| Size | 2411 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:57:05.175868 |

```java
package com.example.server.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "product_reviews",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_review_user_product",
                        columnNames = {"reviewer_id", "product_id"}
                )
        }
)
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "reviewer_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_reviews_reviewer")
    )
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "product_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_reviews_product")
    )
    private Product product;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = false;

    protected ProductReview() {
    }

    public ProductReview(
            User reviewer,
            Product product,
            Integer rating,
            String content
    ) {
        this.reviewer = reviewer;
        this.product = product;
        this.rating = rating;
        this.content = content;
        this.isHidden = false;
    }

    public void hide() {
        this.isHidden = true;
    }

    public Long getId() {
        return id;
    }

    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsHidden() {
        return isHidden;
    }

    public void setIsHidden(Boolean isHidden) {
        this.isHidden = isHidden;
    }
}
```

# main\java\com\example\server\model\SmartPhone.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\SmartPhone.java` |
| Size | 4273 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:15:21.504000 |

```java
package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "smartphone_details")
@PrimaryKeyJoinColumn(name = "product_id")
public class SmartPhone extends Product {

    @Column(name = "chipset", nullable = false, length = 150)
    private String chipset;

    @Column(name = "storage_gb", nullable = false)
    private Integer storageGb;

    @Column(name = "screen_size", nullable = false, precision = 4, scale = 2)
    private BigDecimal screenSize;

    @Column(name = "screen_tech", nullable = false, length = 100)
    private String screenTech;

    @Column(name = "battery_mah", nullable = false)
    private Integer batteryMah;

    @Column(name = "main_camera_mp", nullable = false)
    private Integer mainCameraMp;

    @Column(name = "os", nullable = false, length = 100)
    private String os;

    @Column(name = "color", nullable = false, length = 100)
    private String color;

    @Column(name = "supports_5g", nullable = false)
    private Boolean supports5G = false;

    protected SmartPhone() {
    }

    public SmartPhone(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String chipset,
            Integer storageGb,
            BigDecimal screenSize,
            String screenTech,
            Integer batteryMah,
            Integer mainCameraMp,
            String os,
            String color,
            Boolean supports5G
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.SMARTPHONE,
                status,
                brand,
                warrantyPolicy
        );

        this.chipset = chipset;
        this.storageGb = storageGb;
        this.screenSize = screenSize;
        this.screenTech = screenTech;
        this.batteryMah = batteryMah;
        this.mainCameraMp = mainCameraMp;
        this.os = os;
        this.color = color;
        this.supports5G = supports5G;
    }

    @Override
    public String getSpecifications() {
        return "Chipset: " + chipset
                + ", Storage: " + storageGb + "GB"
                + ", Screen: " + screenSize + "\" " + screenTech
                + ", Battery: " + batteryMah + "mAh"
                + ", Camera: " + mainCameraMp + "MP"
                + ", OS: " + os
                + ", Color: " + color
                + ", 5G: " + supports5G;
    }

    public String getChipset() {
        return chipset;
    }

    public void setChipset(String chipset) {
        this.chipset = chipset;
    }

    public Integer getStorageGb() {
        return storageGb;
    }

    public void setStorageGb(Integer storageGb) {
        this.storageGb = storageGb;
    }

    public BigDecimal getScreenSize() {
        return screenSize;
    }

    public void setScreenSize(BigDecimal screenSize) {
        this.screenSize = screenSize;
    }

    public String getScreenTech() {
        return screenTech;
    }

    public void setScreenTech(String screenTech) {
        this.screenTech = screenTech;
    }

    public Integer getBatteryMah() {
        return batteryMah;
    }

    public void setBatteryMah(Integer batteryMah) {
        this.batteryMah = batteryMah;
    }

    public Integer getMainCameraMp() {
        return mainCameraMp;
    }

    public void setMainCameraMp(Integer mainCameraMp) {
        this.mainCameraMp = mainCameraMp;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getSupports5G() {
        return supports5G;
    }

    public void setSupports5G(Boolean supports5G) {
        this.supports5G = supports5G;
    }
}
```

# main\java\com\example\server\model\Tablet.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\Tablet.java` |
| Size | 3498 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:16:03.987000 |

```java
package com.example.server.model;

import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tablet_details")
@PrimaryKeyJoinColumn(name = "product_id")
public class Tablet extends Product {

    @Column(name = "chipset", nullable = false, length = 150)
    private String chipset;

    @Column(name = "storage_gb", nullable = false)
    private Integer storageGb;

    @Column(name = "screen_size", nullable = false, precision = 4, scale = 2)
    private BigDecimal screenSize;

    @Column(name = "battery_mah", nullable = false)
    private Integer batteryMah;

    @Column(name = "os", nullable = false, length = 100)
    private String os;

    @Column(name = "color", nullable = false, length = 100)
    private String color;

    @Column(name = "has_cellular", nullable = false)
    private Boolean hasCellular = false;

    protected Tablet() {
    }

    public Tablet(
            String sku,
            String name,
            String description,
            BigDecimal price,
            ProductStatus status,
            Brand brand,
            WarrantyPolicy warrantyPolicy,
            String chipset,
            Integer storageGb,
            BigDecimal screenSize,
            Integer batteryMah,
            String os,
            String color,
            Boolean hasCellular
    ) {
        super(
                sku,
                name,
                description,
                price,
                Category.TABLET,
                status,
                brand,
                warrantyPolicy
        );

        this.chipset = chipset;
        this.storageGb = storageGb;
        this.screenSize = screenSize;
        this.batteryMah = batteryMah;
        this.os = os;
        this.color = color;
        this.hasCellular = hasCellular;
    }

    @Override
    public String getSpecifications() {
        return "Chipset: " + chipset
                + ", Storage: " + storageGb + "GB"
                + ", Screen: " + screenSize + "\""
                + ", Battery: " + batteryMah + "mAh"
                + ", OS: " + os
                + ", Color: " + color
                + ", Cellular: " + hasCellular;
    }

    public String getChipset() {
        return chipset;
    }

    public void setChipset(String chipset) {
        this.chipset = chipset;
    }

    public Integer getStorageGb() {
        return storageGb;
    }

    public void setStorageGb(Integer storageGb) {
        this.storageGb = storageGb;
    }

    public BigDecimal getScreenSize() {
        return screenSize;
    }

    public void setScreenSize(BigDecimal screenSize) {
        this.screenSize = screenSize;
    }

    public Integer getBatteryMah() {
        return batteryMah;
    }

    public void setBatteryMah(Integer batteryMah) {
        this.batteryMah = batteryMah;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getHasCellular() {
        return hasCellular;
    }

    public void setHasCellular(Boolean hasCellular) {
        this.hasCellular = hasCellular;
    }
}
```

# main\java\com\example\server\model\User.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\User.java` |
| Size | 4365 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.406054 |

```java
package com.example.server.model;

import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_users_email",
                        columnNames = "email"
                )
        }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @JsonIgnore
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status;

    @JsonIgnore
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Address> addresses = new ArrayList<>();

    @JsonIgnore
    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Cart cart;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Order> orders = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "reviewer")
    private List<ProductReview> reviews = new ArrayList<>();

    protected User() {
    }

    public User(
            String fullName,
            String email,
            String passwordHash,
            String phone,
            Role role,
            UserStatus status
    ) {
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phone = phone;
        this.role = role;
        this.status = status;
    }

    public User(
            String fullName,
            String email,
            String passwordHash,
            String phone,
            String avatarUrl,
            Role role,
            UserStatus status
    ) {
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.role = role;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public List<ProductReview> getReviews() {
        return reviews;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }
}
```

# main\java\com\example\server\model\WarrantyPolicy.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\model\WarrantyPolicy.java` |
| Size | 2445 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:56:30.199283 |

```java
package com.example.server.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "warranty_policies")
public class WarrantyPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "duration_months", nullable = false)
    private Integer durationMonths;

    @Column(name = "coverage", columnDefinition = "TEXT")
    private String coverage;

    @Column(name = "exclusions", columnDefinition = "TEXT")
    private String exclusions;

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @OneToMany(mappedBy = "warrantyPolicy")
    private List<Product> products = new ArrayList<>();

    protected WarrantyPolicy() {
    }

    public WarrantyPolicy(
            String name,
            Integer durationMonths,
            String coverage,
            String exclusions,
            String contactInfo
    ) {
        this.name = name;
        this.durationMonths = durationMonths;
        this.coverage = coverage;
        this.exclusions = exclusions;
        this.contactInfo = contactInfo;
    }

    public boolean isCovered(LocalDate purchaseDate) {
        if (purchaseDate == null || durationMonths == null) {
            return false;
        }
        return purchaseDate.plusMonths(durationMonths).isAfter(LocalDate.now());
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDurationMonths() {
        return durationMonths;
    }

    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }

    public String getCoverage() {
        return coverage;
    }

    public void setCoverage(String coverage) {
        this.coverage = coverage;
    }

    public String getExclusions() {
        return exclusions;
    }

    public void setExclusions(String exclusions) {
        this.exclusions = exclusions;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public List<Product> getProducts() {
        return products;
    }
}
```

# main\java\com\example\server\service\AddressService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\AddressService.java` |
| Size | 0 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:41:17.586371 |

```java

```

# main\java\com\example\server\service\AuthService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\AuthService.java` |
| Size | 2865 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.408057 |

```java
package com.example.server.service;

import com.example.server.dao.UserDao;
import com.example.server.dto.auth.LoginRequest;
import com.example.server.dto.auth.RegisterRequest;
import com.example.server.model.User;
import com.example.server.model.enums.Role;
import com.example.server.model.enums.UserStatus;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;

public class AuthService {
    private final UserDao userDao;

    public AuthService() {
        this.userDao = new UserDao();
    }

    public AuthService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }
        if (userDao.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());

        User newUser = new User(
                request.getFullName(),
                request.getEmail(),
                hashedPassword,
                request.getPhone(),
                Role.CUSTOMER,
                UserStatus.ACTIVE
        );

        User savedUser = userDao.save(newUser);
        if (savedUser == null) {
            throw new RuntimeException("System Error! Cannot register user");
        }
        return savedUser;
    }

    public User login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        Optional<User> userOpt = userDao.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email does not exist");
        }

        User user = userOpt.get();

        boolean isPasswordMatch = BCrypt.checkpw(request.getPassword(), user.getPasswordHash());
        if (user.getStatus() != null && user.getStatus() == UserStatus.LOCKED) {
            throw new RuntimeException("Your account has been locked");
        }
        if (user.getStatus() != null && user.getStatus() == UserStatus.INACTIVE) {
            throw new RuntimeException("Your account is inactive");
        }
        if (!isPasswordMatch) {
            throw new RuntimeException("Password does not match");
        }

        return user;
    }
}

```

# main\java\com\example\server\service\BrandService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\BrandService.java` |
| Size | 1953 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:20:45.835000 |

```java
package com.example.server.service;

import com.example.server.dao.BrandDao;
import com.example.server.dao.impl.BrandDaoImpl;
import com.example.server.dto.brand.BrandResponse;
import com.example.server.exception.AppException;
import com.example.server.model.Brand;

import java.util.List;
import java.util.stream.Collectors;

public class BrandService {
    private final BrandDao brandDao = new BrandDaoImpl();

    public List<BrandResponse> getAllBrands() {
        return brandDao.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public BrandResponse getBrandById(Long id) {
        Brand brand = brandDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Brand not found with id: " + id));
        return convertToResponse(brand);
    }

    public BrandResponse createBrand(Brand brand) {
        brandDao.save(brand);
        return convertToResponse(brand);
    }

    public BrandResponse updateBrand(Long id, Brand updatedDetails) {
        Brand brand = brandDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Brand not found with id: " + id));
        brand.setName(updatedDetails.getName());
        brand.setLogoUrl(updatedDetails.getLogoUrl());
        brand.setDescription(updatedDetails.getDescription());
        brandDao.update(brand);
        return convertToResponse(brand);
    }

    public void deleteBrand(Long id) {
        boolean deleted = brandDao.deleteById(id);
        if (!deleted) {
            throw new AppException("Brand not found with id: " + id);
        }
    }

    private BrandResponse convertToResponse(Brand brand) {
        BrandResponse res = new BrandResponse();
        res.setId(brand.getId());
        res.setName(brand.getName());
        res.setLogoUrl(brand.getLogoUrl());
        res.setDescription(brand.getDescription());
        return res;
    }
}
```

# main\java\com\example\server\service\CartService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\CartService.java` |
| Size | 0 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:41:34.733218 |

```java

```

# main\java\com\example\server\service\CouponService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\CouponService.java` |
| Size | 0 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:41:26.070451 |

```java

```

# main\java\com\example\server\service\EmailService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\EmailService.java` |
| Size | 71 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:39:42.047624 |

```java
package com.example.server.service;

public class EmailService {
}

```

# main\java\com\example\server\service\OrderService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\OrderService.java` |
| Size | 0 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:41:29.090663 |

```java

```

# main\java\com\example\server\service\PaymentService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\PaymentService.java` |
| Size | 0 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 21:41:23.314553 |

```java

```

# main\java\com\example\server\service\ProductService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\ProductService.java` |
| Size | 5119 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 22:52:37.929214 |

```java
package com.example.server.service;

import com.example.server.dao.BrandDao;
import com.example.server.dao.ProductDao;
import com.example.server.dao.WarrantyPolicyDao;
import com.example.server.dao.impl.BrandDaoImpl;
import com.example.server.dao.impl.ProductDaoImpl;
import com.example.server.dto.product.ProductCreateRequest;
import com.example.server.dto.product.ProductResponse;
import com.example.server.exception.AppException;
import com.example.server.model.Brand;
import com.example.server.model.Product;
import com.example.server.model.SmartPhone;
import com.example.server.model.WarrantyPolicy;
import com.example.server.model.enums.Category;
import com.example.server.model.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class ProductService {
    private final ProductDao productDao = new ProductDaoImpl();
    private final BrandDao brandDao = new BrandDaoImpl();    private final WarrantyPolicyDao warrantyPolicyDao = new WarrantyPolicyDao();

    public List<ProductResponse> getAllProducts() {
        return productDao.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id));
        return convertToResponse(product);
    }

    public List<ProductResponse> searchProducts(String keyword, Category category, Long brandId, BigDecimal minPrice, BigDecimal maxPrice) {
        return productDao.search(keyword, category, brandId, minPrice, maxPrice).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse createProduct(ProductCreateRequest request) {
        if (request.getSku() != null && productDao.findBySku(request.getSku()).isPresent()) {
            throw new AppException("Product with SKU already exists: " + request.getSku());
        }

        Brand brand = brandDao.findById(request.getBrandId());
        if (brand == null) {
            throw new AppException("Brand not found with id: " + request.getBrandId());
        }

        WarrantyPolicy warrantyPolicy = null;
        if (request.getWarrantyPolicyId() != null) {
            warrantyPolicy = warrantyPolicyDao.findById(request.getWarrantyPolicyId());
        }

        SmartPhone product = new SmartPhone(
                request.getSku(),
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getStatus() != null ? request.getStatus() : ProductStatus.IN_STOCK,
                brand,
                warrantyPolicy,
                "Default Chipset", 128, BigDecimal.valueOf(6.1), "OLED", 4000, 48, "iOS", "Black", true
        );

        productDao.save(product);
        return convertToResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductCreateRequest request) {
        Product product = productDao.findOptionalById(id)
                .orElseThrow(() -> new AppException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setStatus(request.getStatus());

        if (request.getBrandId() != null) {
            Brand brand = brandDao.findById(request.getBrandId());
            if (brand != null) product.setBrand(brand);
        }

        productDao.update(product);
        return convertToResponse(product);
    }

    public void deleteProduct(Long id) {
        if (productDao.findOptionalById(id).isEmpty()) {
            throw new AppException("Product not found with id: " + id);
        }
        if (productDao.hasReferences(id)) {
            throw new AppException(
                    "Cannot delete this product because it is referenced by an order, cart, or review. "
                            + "Set its status to DISCONTINUED instead."
            );
        }

        boolean deleted = productDao.deleteById(id);
        if (!deleted) {
            throw new AppException("Product not found with id: " + id);
        }
    }

    private ProductResponse convertToResponse(Product product) {
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setSku(product.getSku());
        res.setName(product.getName());
        res.setDescription(product.getDescription());
        res.setPrice(product.getPrice());
        res.setCategory(product.getCategory());
        res.setStatus(product.getStatus());
        res.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);
        res.setImageUrls(product.getImages().stream().map(img -> img.getImageUrl()).collect(Collectors.toList()));
        return res;
    }
}
```

# main\java\com\example\server\service\ReviewService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\ReviewService.java` |
| Size | 2466 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 21:20:53.481000 |

```java
package com.example.server.service;

import com.example.server.dao.ProductDao;
import com.example.server.dao.ProductReviewDao;
import com.example.server.dao.UserDao;
import com.example.server.dao.impl.ProductDaoImpl;
import com.example.server.dao.impl.ProductReviewDaoImpl;
import com.example.server.dto.review.ReviewCreateRequest;
import com.example.server.dto.review.ReviewResponse;
import com.example.server.exception.AppException;
import com.example.server.model.Product;
import com.example.server.model.ProductReview;
import com.example.server.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class ReviewService {
    private final ProductReviewDao reviewDao = new ProductReviewDaoImpl();
    private final ProductDao productDao = new ProductDaoImpl();
    private final UserDao userDao = new UserDao();

    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        return reviewDao.findByProductId(productId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse createReview(Long userId, ReviewCreateRequest request) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new AppException("User not found");
        }

        Product product = productDao.findOptionalById(request.getProductId())
                .orElseThrow(() -> new AppException("Product not found"));

        ProductReview review = new ProductReview(user, product, request.getRating(), request.getContent());
        reviewDao.save(review);
        return convertToResponse(review);
    }

    public void hideReview(Long reviewId) {
        ProductReview review = reviewDao.findOptionalById(reviewId)
                .orElseThrow(() -> new AppException("Review not found"));
        review.hide();
        reviewDao.update(review);
    }

    private ReviewResponse convertToResponse(ProductReview review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        res.setReviewerName(review.getReviewer() != null ? review.getReviewer().getFullName() : "Anonymous");
        res.setProductId(review.getProduct() != null ? review.getProduct().getId() : null);
        res.setRating(review.getRating());
        res.setContent(review.getContent());
        res.setIsHidden(review.getIsHidden());
        return res;
    }
}
```

# main\java\com\example\server\service\UserService.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\service\UserService.java` |
| Size | 3776 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.408057 |

```java
package com.example.server.service;

import com.example.server.dao.AddressDao;
import com.example.server.dao.UserDao;
import com.example.server.dto.auth.ChangePasswordRequest;
import com.example.server.dto.user.AddressRequest;
import com.example.server.dto.user.UpdateProfileRequest;
import com.example.server.model.Address;
import com.example.server.model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.Optional;

public class UserService {
    private final UserDao userDao;
    private final AddressDao addressDao;

    public UserService(UserDao userDao, AddressDao addressDao) {
        this.userDao = userDao;
        this.addressDao = addressDao;
    }

    public UserService() {
        this.userDao = new UserDao();
        this.addressDao = new AddressDao();
    }

    public User getProfile(Long userId) {
        User user = userDao.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }

    public User updateProfile(Long userId, UpdateProfileRequest req) {
        User user = getProfile(userId);

        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setAvatarUrl(req.getAvatarUrl());

        User updated = userDao.update(user);
        if (updated != null) {
            return updated;
        } else {
            throw new RuntimeException("Update failed");
        }
    }

    public boolean changePassword(Long userId, ChangePasswordRequest req) {
        User user = getProfile(userId);
        String oldPassword = req.getOldPassword();

        boolean isPasswordMatch = BCrypt.checkpw(oldPassword, user.getPasswordHash());
        if (isPasswordMatch) {
            String newPassword = BCrypt.hashpw(req.getNewPassword(), BCrypt.gensalt());
            user.setPasswordHash(newPassword);
            User updated = userDao.update(user);
            if (updated != null) {
                return true;
            } else {
                throw new RuntimeException("Password change failed");
            }
        } else {
            throw new IllegalArgumentException("Old password does not match");
        }
    }

    // Address Part

    public List<Address> getAddresses(Long userId) {
        return addressDao.findByUserId(userId);
    }

    public Address addAddress(Long userId, AddressRequest req) {
        User user = getProfile(userId);

        Address address = new Address(
                user,
                req.getReceiverName(),
                req.getReceiverPhone(),
                req.getCountry(),
                req.getProvince(),
                req.getDistrict(),
                req.getWard(),
                req.getStreetDetail(),
                req.getIsDefault() != null && req.getIsDefault()
        );

        Address saved = addressDao.save(address);
        if (saved == null) {
            throw new RuntimeException("Add address failed");
        }
        return saved;
    }

    public boolean deleteAddress(Long userId, Long addressId) {
        Address address = addressDao.findById(addressId);
        if (address == null) {
            throw new IllegalArgumentException("Address not found");
        }

        // Security: Identify the User who wants to delete address
        if (!address.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied: Not your address");
        }

        boolean deleted = addressDao.deleteById(addressId);
        if (!deleted) {
            throw new RuntimeException("Delete address failed");
        }
        return true;
    }
}

```

# main\java\com\example\server\util\AppContextListener.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\util\AppContextListener.java` |
| Size | 850 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 19:21:31.140000 |

```java
package com.example.server.util;

import com.example.server.config.JPAConfig;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class AppContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("====================================================");
        System.out.println("[SERVER STARTUP] Initializing Database...");
        System.out.println("====================================================");

        JPAConfig.getEntityManagerFactory();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("[SERVER SHUTDOWN] Closing Database...");

        JPAConfig.shutdown();
    }
}
```

# main\java\com\example\server\util\JpaUtil.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\util\JpaUtil.java` |
| Size | 1015 bytes |
| Extension | `.java` |
| Modified | 2026-10-08 20:59:26.724885 |

```java
package com.example.server.util;

import com.example.server.config.JPAConfig;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;

import java.util.function.Function;

public class JpaUtil {

    public static <T> T executeInTransaction(Function<EntityManager, T> action) {
        return executeInTransaction(JPAConfig.getEntityManagerFactory(), action);
    }

    public static <T> T executeInTransaction(
            EntityManagerFactory emf,
            Function<EntityManager, T> action
    ) {
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            T result = action.apply(em);
            tx.commit();
            return result;
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}
```

# main\java\com\example\server\util\JsonUtil.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\util\JsonUtil.java` |
| Size | 1274 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.409057 |

```java
package com.example.server.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class JsonUtil {

    private static final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public static <T> T toObject(HttpServletRequest request, Class<T> clazz) throws IOException {
        return mapper.readValue(request.getReader(), clazz);
    }

    public static <T> T fromJson(String json, Class<T> clazz) throws IOException {
        return mapper.readValue(json, clazz);
    }

    public static String toJson(Object data) throws IOException {
        return mapper.writeValueAsString(data);
    }

    public static void sendJson(HttpServletResponse response, int statusCode, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(statusCode);
        response.getWriter().write(mapper.writeValueAsString(data));
        response.getWriter().flush();
    }
}

```

# main\java\com\example\server\util\SessionUtil.java

| Property | Value |
|----------|-------|
| Path | `main\java\com\example\server\util\SessionUtil.java` |
| Size | 950 bytes |
| Extension | `.java` |
| Modified | 2026-10-11 18:18:50.410057 |

```java
package com.example.server.util;

import com.example.server.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class SessionUtil {

    public static final String CURRENT_USER_KEY = "currentUser";

    public static void setLoggedInUser(HttpServletRequest request, User user) {
        HttpSession session = request.getSession(true);
        session.setAttribute(CURRENT_USER_KEY, user);
    }

    public static User getLoggedInUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }
        return (User) session.getAttribute(CURRENT_USER_KEY);
    }

    public static void clearSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }
}

```

# main\resources\.example

| Property | Value |
|----------|-------|
| Path | `main\resources\.example` |
| Size | 89 bytes |
| Extension | `` |
| Modified | 2026-10-05 10:38:49.901000 |

```
db.url=jdbc:mysql://localhost:3306/phone_store
db.username=root
db.password=your_password
```

# main\resources\db.properties

| Property | Value |
|----------|-------|
| Path | `main\resources\db.properties` |
| Size | 115 bytes |
| Extension | `.properties` |
| Modified | 2026-10-08 19:24:12.295000 |

```properties
db.url=jdbc:mysql://localhost:3306/phone_store
db.user=root
db.password=pgmmg
db.driver=com.mysql.cj.jdbc.Driver
```

# main\resources\META-INF\persistence.xml

| Property | Value |
|----------|-------|
| Path | `main\resources\META-INF\persistence.xml` |
| Size | 2449 bytes |
| Extension | `.xml` |
| Modified | 2026-10-11 14:59:21.486152 |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"
             version="3.0">

    <persistence-unit name="PhoneStorePU" transaction-type="RESOURCE_LOCAL">
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <!-- Danh sách các JPA Entities -->
        <class>com.example.server.model.User</class>
        <class>com.example.server.model.Address</class>
        <class>com.example.server.model.Brand</class>
        <class>com.example.server.model.WarrantyPolicy</class>
        <class>com.example.server.model.Product</class>
        <class>com.example.server.model.SmartPhone</class>
        <class>com.example.server.model.Tablet</class>
        <class>com.example.server.model.Accessory</class>
        <class>com.example.server.model.Charger</class>
        <class>com.example.server.model.Cable</class>
        <class>com.example.server.model.Case</class>
        <class>com.example.server.model.Earphone</class>
        <class>com.example.server.model.ProductImage</class>
        <class>com.example.server.model.ProductReview</class>
        <class>com.example.server.model.Cart</class>
        <class>com.example.server.model.CartItem</class>
        <class>com.example.server.model.Order</class>
        <class>com.example.server.model.OrderItem</class>
        <class>com.example.server.model.Payment</class>
        <class>com.example.server.model.Coupon</class>

        <properties>
            <!-- Cấu hình Hibernate cho MySQL -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.MySQLDialect"/>
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/>

            <!-- Cấu hình HikariCP Connection Pool tích hợp -->
            <property name="hibernate.hikari.maximumPoolSize" value="20"/>
            <property name="hibernate.hikari.minimumIdle" value="5"/>
            <property name="hibernate.hikari.idleTimeout" value="300000"/>
            <property name="hibernate.hikari.connectionTimeout" value="20000"/>
        </properties>
    </persistence-unit>
</persistence>
```

# main\webapp\index.jsp

| Property | Value |
|----------|-------|
| Path | `main\webapp\index.jsp` |
| Size | 246 bytes |
| Extension | `.jsp` |
| Modified | 2026-10-05 09:11:54.190082 |

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <title>JSP - Hello World</title>
</head>
<body>
<h1><%= "Hello World!" %></h1>
<br/>
<a href="hello-servlet">Hello Servlet</a>
</body>
</html>
```

# main\webapp\WEB-INF\web.xml

| Property | Value |
|----------|-------|
| Path | `main\webapp\WEB-INF\web.xml` |
| Size | 778 bytes |
| Extension | `.xml` |
| Modified | 2026-10-08 18:42:16.871000 |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">

    <display-name>Phone Store Backend API</display-name>

    <!-- Cấu hình Session & Cookie cho Next.js -->
    <session-config>
        <session-timeout>120</session-timeout> <!-- Timeout: 120 phút -->
        <cookie-config>
            <http-only>true</http-only> <!-- Chống XSS đọc Cookie -->
            <secure>false</secure>     <!-- Đặt true nếu chạy HTTPS -->
            <name>JSESSIONID</name>
        </cookie-config>
    </session-config>

</web-app>
```

# projectdump.py

| Property | Value |
|----------|-------|
| Path | `projectdump.py` |
| Size | 2978 bytes |
| Extension | `.py` |
| Modified | 2026-09-24 11:16:08.308386 |

```py
#!/usr/bin/env python3

import os
from pathlib import Path
from datetime import datetime



try:
    from pathspec import PathSpec
except ImportError:
    print("Install pathspec first:")
    print("pip install pathspec")
    raise

MAX_LINES = 5000

OUTPUT_FILE = "project.md"

DEFAULT_IGNORES = [
    "node_modules/",
    ".venv/",
    "venv/",
    ".git/",
    ".gitignore",
    OUTPUT_FILE,
]

def should_skip_file(file_path: Path):
    try:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            for i, _ in enumerate(f, start=1):
                if i > MAX_LINES:
                    return True
        return False
    except Exception:
        # If we can't read it as text, assume it's binary and skip it.
        return True

def load_gitignore(root: Path):
    patterns = []

    gitignore = root / ".gitignore"

    if gitignore.exists():
        with open(gitignore, encoding="utf-8") as f:
            patterns.extend(f.read().splitlines())

    patterns.extend(DEFAULT_IGNORES)

    return PathSpec.from_lines("gitwildmatch", patterns)


def get_file_info(path: Path):
    stat = path.stat()

    return {
        "size": stat.st_size,
        "modified": datetime.fromtimestamp(stat.st_mtime),
        "suffix": path.suffix,
    }


def write_file_section(md, root: Path, file_path: Path):
    relative = file_path.relative_to(root)

    try:
        content = file_path.read_text(
            encoding="utf-8",
            errors="replace"
        )
    except Exception as e:
        content = f"Could not read file:\n{e}"

    info = get_file_info(file_path)

    md.write(f"# {relative}\n\n")
    md.write("| Property | Value |\n")
    md.write("|----------|-------|\n")
    md.write(f"| Path | `{relative}` |\n")
    md.write(f"| Size | {info['size']} bytes |\n")
    md.write(f"| Extension | `{info['suffix']}` |\n")
    md.write(f"| Modified | {info['modified']} |\n\n")

    lang = info["suffix"].lstrip(".")

    md.write(f"```{lang}\n")
    md.write(content)
    md.write("\n```\n\n")


def main():
    root = Path(os.getcwd())

    spec = load_gitignore(root)

    files = []

    for file in root.rglob("*"):
        if not file.is_file():
            continue

        relative = file.relative_to(root).as_posix()

        if spec.match_file(relative):
            continue

        if should_skip_file(file):
            print(f"Skipping (>{MAX_LINES} lines): {relative}")
            continue

        files.append(file)

    files.sort()

    with open(root / OUTPUT_FILE, "w", encoding="utf-8") as md:
        md.write(f"# Project dump\n\n")
        md.write(f"Root: `{root}`\n\n")
        md.write(f"Generated: {datetime.now()}\n\n")

        for file in files:
            write_file_section(md, root, file)

    print(f"Saved {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
```

