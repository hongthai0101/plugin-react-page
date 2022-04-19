import axios from "axios";
import * as urls from "./url";

export function getListRequest(filter) {
  const query = `filter=${encodeURI(JSON.stringify(filter))}`;
  let url = urls.getConsultingUrl(query);
  return axios({
    method: "get",
    url,
  }).then((rs) => rs.data);
}

export function updateRequestById(id, data) {
  // const query = `filter=${encodeURI(JSON.stringify(filter))}`;
  let url = urls.updateConsultingUrl(id);
  return axios({
    method: "patch",
    data,
    url,
  }).then((rs) => rs.data);
}

export function countRequest(filter) {
  const query = `filter=${encodeURI(JSON.stringify(filter))}`;
  let url = urls.countConsultingUrl(query);
  return axios({
    method: "get",
    url,
  }).then((rs) => rs.data);
}
