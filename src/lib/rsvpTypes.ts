export type RsvpSubmission = {
  id: string;
  fullName: string;
  phone: string;
  guestCount: number;
  attending: boolean;
  message: string | null;
  createdAt: string;
};

export type RsvpPayload = {
  fullName: string;
  phone: string;
  guestCount: number;
  attending: boolean;
  message?: string;
};
