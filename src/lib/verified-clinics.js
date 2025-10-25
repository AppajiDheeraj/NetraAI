// This file acts as our mock database of verified clinics.
// In a real app, this data would come from a database after a verification process.

export const verifiedClinics = [
  {
    hfrId: "12-34-5678-ABCD",
    name: "Apollo Clinic - Jubilee Hills",
    address: "Road No. 36, Jubilee Hills, Hyderabad",
  },
  {
    hfrId: "98-76-5432-WXYZ",
    name: "Max Healthcare - Saket",
    address: "Press Enclave Marg, Saket, New Delhi",
  },
  {
    hfrId: "11-22-3344-EFGH",
    name: "Fortis Hospital - Bannerghatta",
    address: "Bannerghatta Road, Bengaluru",
  },
  // Add a few more valid IDs for your testing and demo
];

// We can also create a simple Set for faster lookups of just the IDs
export const verifiedHfrIdSet = new Set(verifiedClinics.map(clinic => clinic.hfrId));
