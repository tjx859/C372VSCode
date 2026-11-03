# Feature: Prepare payment details

## 1. User goal & Delivery surface
As a pet owner, I want to review payment details via the API so that I can prepare to make a payment for a pet service.

**Delivery surface:** This feature is strictly limited to providing the `GET /payments/prepare/:serviceId` JSON API response. Any UI/frontend rendering (including EJS pages) is explicitly out of scope.

## 2. Scope
Provide API endpoint to review selected service name and catalogue price before payment.

Use the server catalogue price as the source of truth for `amount`. Do not accept a client-supplied payment amount.

## 3. Request
`GET /payments/prepare/:serviceId`

## 4. Service catalogue (Source of Truth)
| id | service name | price |
| :--- | :--- | :--- |
| 1 | Vaccination | 35 |
| 2 | Pet Grooming | 50 |
| 3 | Boarding | 80 |

*Note: Catalogue prices are represented as numeric values without currency symbols.*

## 5. Successful response
HTTP 200 with exactly five JSON fields:
* `serviceId` (number): The numeric ID of the selected service matching the path parameter.
* `serviceName` (string): Exact service name from Section 4 catalogue (e.g., `"Pet Grooming"`).
* `amount` (number): Exact price from Section 4 catalogue matching the selected service.
* `currency` (string): Exact string literal `"sgd"`.
* `status` (string): Exact string literal `"READY_FOR_PAYMENT"`.

## 6. Unsuccessful response
* **Unknown Service:** When `:serviceId` is a valid positive integer format but does not match any ID in the catalogue (e.g., `999`):
  * **Status:** HTTP 404
  * **Body:** `{"error":"Service not found"}`
* **Invalid Service ID Format:** When `:serviceId` is not a valid positive integer representation (defined as an unpadded, unsigned sequence of base-10 digits greater than zero, such as `1`, `2`, `3`):
  * Non-numeric strings (e.g., `abc`), floating-point numbers (e.g., `1.5`), zero or negative integers (e.g., `0`, `-1`), zero-padded integers (e.g., `01`), and explicitly signed integers (e.g., `+1`) are invalid.
  * **Status:** HTTP 400
  * **Body:** `{"error":"Invalid service ID"}`

## 7. Acceptance criteria
* **AC1:** `GET /payments/prepare/1` -> HTTP 200; `serviceName`: `"Vaccination"`, `amount`: `35`, `serviceId`: `1`.
* **AC2:** `GET /payments/prepare/2` -> HTTP 200; `serviceName`: `"Pet Grooming"`, `amount`: `50`, `serviceId`: `2`.
* **AC3:** `GET /payments/prepare/3` -> HTTP 200; `serviceName`: `"Boarding"`, `amount`: `80`, `serviceId`: `3`.
* **AC4:** `GET /payments/prepare/999` -> HTTP 404; exact error body: `{"error":"Service not found"}`.
* **AC5:** Each successful response contains exactly the five required fields (`serviceId`, `serviceName`, `amount`, `currency`, `status`) with matching types, exact catalogue values, `"sgd"`, and `"READY_FOR_PAYMENT"`.
* **AC6:** `GET /payments/prepare/abc` -> HTTP 400; exact error body: `{"error":"Invalid service ID"}`.
* **AC7:** `GET /payments/prepare/1.5` -> HTTP 400; exact error body: `{"error":"Invalid service ID"}`.
* **AC8:** `GET /payments/prepare/0` -> HTTP 400; exact error body: `{"error":"Invalid service ID"}`.
* **AC9:** `GET /payments/prepare/-1` -> HTTP 400; exact error body: `{"error":"Invalid service ID"}`.
* **AC10:** `GET /payments/prepare/01` -> HTTP 400; exact error body: `{"error":"Invalid service ID"}`.
* **AC11:** `GET /payments/prepare/+1` -> HTTP 400; exact error body: `{"error":"Invalid service ID"}`.

**Access:** No login required for this classroom mock.  
**Out of scope:** Charging money, payment gateway integration, recording transactions, new database tables, EJS pages, handling of additional failure scenarios (such as HTTP 500 or rate limiting), or changes to existing features.

## 8. Decided items
1. **Invalid `:serviceId` path parameter format:**
   * **Decision:** Treat any path parameter that is not an unpadded, unsigned positive base-10 integer as an invalid ID format. Return HTTP 400 with `{"error":"Invalid service ID"}`. Rules are defined in Section 6 and validated in AC6–AC11.
2. **Other failure cases:**
   * **Decision:** No additional failure cases (e.g., HTTP 500 server errors, database connection failures, rate limiting) are in scope for this classroom mock. Only HTTP 400 (invalid format) and HTTP 404 (unknown service) are required.