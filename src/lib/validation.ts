import { findDemoUser } from "./auth.ts";
import { rentalDays, MAX_RENTAL_DAYS } from "./pricing.ts";

export type BookingDraft = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  chauffeur: boolean;
  insurance: boolean;
  childSeat: boolean;
  licenseNumber: string;
  consent: boolean;
};

type Errors<T> = Partial<Record<keyof T, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^(\+?63|0)\d{9,11}$/;
const LICENSE = /^[A-Za-z0-9][A-Za-z0-9-]{7,14}$/;

export function validateBooking(
  draft: BookingDraft,
  today: string
): Errors<BookingDraft> {
  const errors: Errors<BookingDraft> = {};

  if (draft.customerName.trim().length < 2) {
    errors.customerName = "Please enter your full name.";
  }
  if (!EMAIL.test(draft.customerEmail.trim())) {
    errors.customerEmail = "Enter a valid email.";
  }
  if (!PHONE.test(draft.customerPhone.replace(/[^\d+]/g, ""))) {
    errors.customerPhone = "Enter a valid PH phone number.";
  }
  if (!draft.pickupLocation) {
    errors.pickupLocation = "Choose a pickup location.";
  }
  if (!draft.pickupDate) {
    errors.pickupDate = "Choose a pickup date.";
  } else if (draft.pickupDate < today) {
    errors.pickupDate = "Pickup date cannot be in the past.";
  }
  if (!draft.returnDate) {
    errors.returnDate = "Choose a return date.";
  } else if (draft.pickupDate && draft.returnDate <= draft.pickupDate) {
    errors.returnDate = "Return date must be after pickup.";
  } else if (
    draft.pickupDate &&
    rentalDays(draft.pickupDate, draft.returnDate) > MAX_RENTAL_DAYS
  ) {
    errors.returnDate = `Rentals are limited to ${MAX_RENTAL_DAYS} days.`;
  }

  if (!draft.chauffeur) {
    if (!LICENSE.test(draft.licenseNumber.trim())) {
      errors.licenseNumber = "Enter a valid driver's license number.";
    }
  }

  if (!draft.consent) {
    errors.consent = "Please accept the rental terms.";
  }

  return errors;
}

export type InquiryDraft = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function validateInquiry(draft: InquiryDraft): Errors<InquiryDraft> {
  const errors: Errors<InquiryDraft> = {};

  if (draft.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(draft.email.trim())) errors.email = "Enter a valid email.";
  if (!PHONE.test(draft.phone.replace(/[^\d+]/g, ""))) {
    errors.phone = "Enter a valid PH phone number.";
  }
  if (draft.subject.trim().length < 4) errors.subject = "Add a short subject.";
  if (draft.message.trim().length < 10) {
    errors.message = "Tell us a little more (at least 10 characters).";
  }

  return errors;
}

export function validateLogin(
  email: string,
  password: string
): string | undefined {
  if (!email.trim() || !password) return "Enter your email and password.";
  if (!findDemoUser(email, password)) {
    return "Incorrect email or password. Use one of the demo accounts below.";
  }
  return undefined;
}
