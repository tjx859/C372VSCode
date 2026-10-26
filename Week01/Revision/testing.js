const paymentStatus = "APPROVED";

switch (paymentStatus) {
  case "APPROVED":
    console.log("Pet-care service confirmed");
    break;
  case "PENDING":
    console.log("Payment is being processed");
    break;
  case "DECLINED":
    console.log("Payment unsuccessful");
    break;
}