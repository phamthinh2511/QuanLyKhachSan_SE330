import { Invoice } from "@/types/invoice";

const now = new Date();
const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

export const mockInvoices: Invoice[] = [];