import axios from "axios";
import type { NextPage } from "next";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { usePagination, useTable } from "react-table";

function Table({ columns, data }: any) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,

        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 2 },
        },
        usePagination
    );

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        // eslint-disable-next-line react/jsx-key
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        // eslint-disable-next-line react/jsx-key
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>{" "}
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                </button>{" "}
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {">>"}
                </button>{" "}
                <span>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </span>
                <span>
                    | Go to page:{" "}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(page);
                        }}
                        style={{ width: "100px" }}
                    />
                </span>{" "}
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}

const Home: NextPage = () => {
    const [data, setData] = React.useState([]);
    const [button, setButton] = React.useState("Tambah Data");
    const [show, setShow] = React.useState(false);

    const [title, setTitle] = React.useState("");
    const [body, setBody] = React.useState("");

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
    };

    const handleUpdate = (data: any) => {
        setButton("Edit Data");
        setShow(true);
        setTitle(data.title);
        setBody(data.body);
    };

    const handleDelete = async (id: number) => {
        const res = await axios.delete(
            "https://jsonplaceholder.typicode.com/posts/1"
        );

        console.log(res);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "Title",
                accessor: "title",
            },
            {
                Header: "Body",
                accessor: "body",
            },
            {
                Header: "Action",
                accessor: "id",
                Cell: (value: any) => {
                    return (
                        <>
                            <Button
                                variant="success"
                                onClick={() => handleUpdate(value.row.original)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() =>
                                    handleDelete(value.row.original.id)
                                }
                            >
                                Hapus
                            </Button>
                        </>
                    );
                },
            },
        ],
        []
    );

    const getData = async () => {
        const res = await axios.get(
            "https://jsonplaceholder.typicode.com/posts"
        );
        setData(res.data);
    };

    const onSubmit = async () => {
        if (button === "Tambah Data") {
            const postBody = {
                userId: 1,
                title,
                body,
            };

            const res = await axios.post(
                "https://jsonplaceholder.typicode.com/posts",
                postBody
            );

            // setData([...data, res.data]);

            setShow(false);
            setTitle("");
            setBody("");
        } else {
            const postBody = {
                userId: 1,
                title,
                body,
            };

            const res = await axios.put(
                "https://jsonplaceholder.typicode.com/posts/1",
                postBody
            );

            // setData([...data, res.data]);

            setShow(false);
            setButton("Tambah Data");
            setTitle("");
            setBody("");
        }
    };

    React.useEffect(() => {
        getData();
    }, []);

    // const calculator = (numberOne: number, numberTwo: number) => {
    //     return numberOne + numberTwo;
    // };

    // calculator(0, 1);

    return (
        <div className="container pt-5">
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{button}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                        >
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Body</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter body..."
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        {button}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Table columns={columns} data={data} />
        </div>
    );
};

export default Home;
