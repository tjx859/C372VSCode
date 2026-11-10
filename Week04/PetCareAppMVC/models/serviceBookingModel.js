const connection = require('../config/db');

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  connection.getConnection((connectErr, conn) => {
    if (connectErr) {
      return callback(connectErr);
    }

    conn.beginTransaction((txErr) => {
      if (txErr) {
        conn.release();
        return callback(txErr);
      }

      const verifySql = `
        SELECT p.id AS pet_id, s.id AS service_id, s.price AS service_price
        FROM pets p
        JOIN services s ON s.id = ?
        WHERE p.id = ?
          AND p.owner_id = ?
          AND s.is_active = 1
      `;

      conn.query(verifySql, [serviceId, petId, ownerId], (verifyErr, rows) => {
        if (verifyErr) {
          conn.rollback(() => {
            conn.release();
            callback(verifyErr);
          });
          return;
        }

        if (!rows || rows.length === 0) {
          conn.rollback(() => {
            conn.release();
            callback(null, null);
          });
          return;
        }

        const servicePrice = rows[0].service_price;
        const bookingSql = `
          INSERT INTO service_bookings (pet_id, service_id, booking_status, booked_price, booking_date)
          VALUES (?, ?, 'pending', ?, ?)
        `;

        conn.query(bookingSql, [petId, serviceId, servicePrice, bookingDate], (bookingErr, bookingResult) => {
          if (bookingErr) {
            conn.rollback(() => {
              conn.release();
              callback(bookingErr);
            });
            return;
          }

          const paymentSql = `
            INSERT INTO payments (booking_id, amount, payment_status, payment_reference)
            VALUES (?, ?, 'pending', NULL)
          `;

          conn.query(paymentSql, [bookingResult.insertId, servicePrice], (paymentErr, paymentResult) => {
            if (paymentErr) {
              conn.rollback(() => {
                conn.release();
                callback(paymentErr);
              });
              return;
            }

            conn.commit((commitErr) => {
              if (commitErr) {
                conn.rollback(() => {
                  conn.release();
                  callback(commitErr);
                });
                return;
              }

              conn.release();
              callback(null, {
                bookingId: bookingResult.insertId,
                paymentId: paymentResult.insertId
              });
            });
          });
        });
      });
    });
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      sb.id AS booking_id,
      sb.booking_date,
      p.name AS pet_name,
      s.name AS service_name,
      sb.booked_price,
      sb.booking_status,
      pay.payment_status
    FROM service_bookings sb
    JOIN pets p ON p.id = sb.pet_id
    JOIN services s ON s.id = sb.service_id
    LEFT JOIN payments pay ON pay.booking_id = sb.id
    WHERE p.owner_id = ?
    ORDER BY sb.created_at DESC, sb.id DESC
  `;

  connection.query(sql, [ownerId], callback);
}

module.exports = {
  createPendingBooking,
  getBookingsByOwner
};
