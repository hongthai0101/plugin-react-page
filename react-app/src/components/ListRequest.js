import React, { useEffect, useState, useCallback } from "react";
import Styles from "../constants/Styled";
import Table from "../constants/Table";
import { getListRequest, updateRequestById, countRequest } from "../apis";
import { Input, FormGroup, Form, Label, Button, InputGroup } from "reactstrap";
import {
  moneyItemAdapter,
  dateTimeAdapter,
  statusAdapter,
} from "../utils/common";

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [keySearch, setKeySearch] = useState("");
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentPageIndex, setPageIndex] = useState(0);

  const fetchIdRef = React.useRef(0);

  useEffect(() => {
    countRequest().then((rs) => setPageCount(rs.count));
  }, []);

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;

    setLoading(true);

    if (fetchId === fetchIdRef.current) {
      const startRow = pageSize * pageIndex;

      // const endRow = startRow + pageSize;

      setCurrentPageSize(pageSize);
      setPageIndex(pageIndex);

      const filter = {
        offset: startRow,
        limit: pageSize,
        order: ["createdAt DESC"],
      };
      getListRequest(filter)
        .then((res) => setRequests(res))
        .catch((err) => {
          throw err;
        });

      // Your server could send back total page count.
      // For now we'll just fake it, too

      setLoading(false);
    }
  }, []);
  // const data = React.useMemo(() => requests, []);
  const handleClick = useCallback(
    async (id, body) => {
      try {
        await updateRequestById(id, body);
        fetchData({ pageSize: currentPageSize, pageIndex: currentPageIndex });
      } catch (error) {
        throw error;
      }
    },
    [currentPageIndex, currentPageSize]
  );

  const onSearch = useCallback(async (keySearch) => {
    try {
      const filter = {
        where: {
          phone: {
            like: `.*${keySearch}.*`,
          },
        },
      };
      const data = await getListRequest(filter);
      setRequests(data);
      const count = await countRequest(filter);
      setPageCount(count.count);
    } catch (error) {
      throw error;
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Th??ng tin kh??ch h??ng",
        columns: [
          {
            Header: "H??? t??n",
            accessor: "name",
          },
          {
            Header: "SDT",
            accessor: "phone",
          },
          {
            Header: "?????a ch???",
            accessor: (d) => d,
            Cell: ({ value }) => {
              return (
                <div>
                  {value.purchaseMethod === "TCH"
                    ? "129 Ho??ng V??n Th???, Ph?????ng 8, Ph?? Nhu???n, TPHCM"
                    : ` ${value.address}, ${value.ward}, ${value.district}, ${value.province}`}
                </div>
              );
            },
          },
        ],
      },
      {
        Header: "Th??ng tin s???n ph???m",
        columns: [
          {
            Header: "S???n ph???m",
            accessor: (d) => d.product,
            Cell: ({ value }) => {
              return (
                <div>
                  {value.brand} - {value.model}
                  {value?.attributeOptions.map((item) => (
                    <div>
                      <span className="fw-bold">{item.name}</span>: {item.value}
                    </div>
                  ))}
                </div>
              );
            },
          },
          {
            Header: "Gi?? ?????nh gi??",
            accessor: (d) => moneyItemAdapter(d.valuationPrice),
          },
          {
            Header: "Ng??y t???o",
            accessor: (d) => dateTimeAdapter(d.createdAt),
          },
        ],
      },
      {
        Header: "Tr???ng th??i",
        accessor: (d) => d,
        Cell: ({ value }) => statusAdapter(value.status),
      },
      {
        Header: "H??nh ?????ng",
        accessor: (d) => d,
        Cell: ({ value }) => {
          return (
            <div>
              <Button
                color="success"
                className="mx-2"
                onClick={() => handleClick(value.id, { status: "completed" })}
                disabled={["completed", "rejected"].includes(value.status)}
              >
                X??c nh???n
              </Button>
              <Button
                color="danger"
                onClick={() => handleClick(value.id, { status: "rejected" })}
                disabled={["completed", "rejected"].includes(value.status)}
              >
                T??? ch???i
              </Button>
            </div>
          );
        },
      },
    ],
    [currentPageIndex, currentPageSize]
  );

  return (
    <div>
      <Form className="p-3">
        <FormGroup>
          <Label for="exampleEmail">T??m ki???m</Label>
          <InputGroup>
            <Input
              placeholder="Nh???p s??? ??i???n tho???i"
              onChange={(e) => setKeySearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  onSearch(keySearch);
                }
              }}
            />
            <Button color="primary" onClick={() => onSearch(keySearch)}>
              T??m ki???m
            </Button>
          </InputGroup>
        </FormGroup>
      </Form>
      <Styles>
        {
          <Table
            columns={columns}
            data={requests}
            loading={loading}
            fetchData={fetchData}
            pageCount={pageCount}
          />
        }
      </Styles>
    </div>
  );
};

export default RequestList;
