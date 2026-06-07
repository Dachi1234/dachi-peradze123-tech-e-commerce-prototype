# Business Requirements Document  
**TechStore E-Commerce Prototype**

**Version:** 1.0  
**Date:** June 7, 2026  
**Author:** Salome Khachidze  
**Scope:** Authentication & Product Ratings

---

## 1. Goals

Provide TechStore with a simple, functional authentication system and a product rating feature so users can create accounts, log in, and rate products (phones & laptops). This BRD defines the minimum requirements for these two features to guide development without scope creep.

---

## 2. Users

**Primary user:**  
- Age: 18–45  
- Tech-savvy consumers shopping for phones and laptops  
- Expects standard e-commerce login/registration flows  
- Wants to see product ratings and contribute their own ratings after purchase or evaluation

---

## 3. User Stories

**As a visitor**, I want to register for an account so I can rate products.  
**As a visitor**, I want to log in to my existing account so I can access rating features.  
**As a logged-in user**, I want to rate a product (1–5 stars) so I can share my opinion.  
**As any visitor**, I want to see product ratings so I can make informed purchase decisions.

---

## 4. Functional Requirements

### 4.1 User Registration

- User can register with **username** and **password** only.
- No email field required.
- No email verification step.
- Username must be unique across the system.
- Password must be at least 6 characters (basic validation).
- After successful registration, user is **automatically logged in** and redirected to the homepage.
- If registration fails (e.g., username already exists), show clear error message.

### 4.2 User Login

- User can log in with **username** and **password**.
- Successful login creates a session that persists across page reloads.
- Failed login shows an error message ("Invalid username or password").
- After successful login, user is redirected to the homepage.

### 4.3 Product Ratings

- **Only registered and logged-in users** can submit a product rating.
- **All visitors** (logged in or not) can **view** product ratings.
- Each user can submit **one rating per product** (1–5 stars).
- If a user has already rated a product, they cannot rate it again (show message: "You have already rated this product").
- Product page displays the **average rating** and **total number of ratings**.
- Ratings are visible immediately after submission (no approval workflow).

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Login and registration flows should complete within 2 seconds under normal network conditions.
- Ratings should update on the product page within 1 second of submission.

### 5.2 Security (deferred)
- Passwords stored in plain text or minimal hashing is acceptable **for this prototype phase**.
- Full security hardening (bcrypt, HTTPS enforcement, CSRF protection, rate limiting) is **postponed to a later phase**.

### 5.3 User Roles
- No user role system (admin, customer, etc.) in this phase.
- All registered users have identical permissions.

---

## 6. Out of Scope

The following features are **explicitly excluded** from this BRD to prevent scope creep:

- Cart functionality  
- Checkout and payment flows  
- Product search and filtering improvements  
- User profile management (profile page, edit account, delete account)  
- Password recovery ("Forgot password")  
- Email notifications  
- Social login (Google, Facebook, etc.)  
- User reviews (text-based feedback, only star ratings are in scope)  
- Admin dashboard  

---

## 7. Assumptions

- The frontend UI for login, registration, and rating forms already exists or will be built by Giorgi.
- A database (or equivalent data store) is available to persist users and ratings.
- Session management is handled via cookies or local storage (implementation detail left to developer).

---

## 8. Open Questions

*(None at this time — scope is clear.)*

---

## 9. Acceptance Criteria

### Registration
- [ ] User can submit username + password and create an account  
- [ ] Duplicate username is rejected with an error message  
- [ ] User is auto-logged-in after registration  
- [ ] User is redirected to homepage after registration  

### Login
- [ ] User can log in with valid username + password  
- [ ] Invalid credentials show error message  
- [ ] Session persists across page reloads  
- [ ] User is redirected to homepage after login  

### Ratings
- [ ] Only logged-in users see the "rate this product" interface  
- [ ] User can submit a rating (1–5 stars) on a product  
- [ ] User cannot rate the same product twice  
- [ ] All visitors can see average rating and total rating count on product page  
- [ ] Rating updates are visible immediately after submission  

---

**End of Document**