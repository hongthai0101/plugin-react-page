import { baseURL } from "./config";

export const getConsultingUrl = (query) =>
  `${baseURL}/consulting-infos?${query}`;
export const countConsultingUrl = (query) =>
  `${baseURL}/consulting-infos/count?${query}`;
export const updateConsultingUrl = (id) => `${baseURL}/consulting-infos/${id}`;
