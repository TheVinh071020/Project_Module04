import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PaginationUser from "./PaginationUser";
import axios from "axios";

interface User {
  users_id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: number;
}

function UserAdmin() {
  // let token = localStorage.getItem("token");

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  const fetchUser = async (pageIndex: number, pageNumber: number) => {

    await axios
      .get(
        `http://localhost:3000/api/v1/users?page_index=${pageIndex}&page_number=${pageNumber}`
      )
      .then((res) => {
        setUsers(res.data.data);
        setTotal(res.data.length);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUser(1, 5);
  }, []);

  // delete
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/v1/users/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Your user has been deleted.", "success");
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.users_id !== id)
            );
          })
          .catch((err) => console.error("Failed to delete user:", err));
      }
    });
  };

  // Lock user
  const handleLockUser = async (id: any) => {
    try {
      await axios.patch(`http://localhost:3000/api/v1/users/${id}`, {
        status: 1,
      });

      const updatedUsers = users.map((u: any) =>
        u.users_id === id ? { ...u, status: 1 } : u
      );
      setUsers(updatedUsers);
      console.log("User locked successfully");
    } catch (err) {
      console.error("Failed to lock user:", err);
    }
  };

  const handleUnLockUser = async (id: any) => {
    try {
      await axios.patch(`http://localhost:3000/api/v1/users/${id}`, {
        status: 0,
      });
      const updatedUsers = users.map((u: any) =>
        u.users_id === id ? { ...u, status: 0 } : u
      );
      setUsers(updatedUsers);
      console.log("User unlocked successfully");
    } catch (err) {
      console.error("Failed to lock user:", err);
    }
  };

  return (
    <div>
      <h1>Admin User</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            {/* <th scope="col" colSpan={3}>
              Action
            </th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.users_id}>
              <th scope="row">{index + 1}</th>
              <td>{user.users_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.role}</td>
              <td>
                {user.status === 0 ? (
                  <button
                    className="btn btn-outline-success"
                    onClick={() => handleLockUser(user.users_id)}
                  >
                    Unlock
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleUnLockUser(user.users_id)}
                  >
                    Lock
                  </button>
                )}
              </td>
              {/* <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.users_id)}
                >
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationUser total={total} pageNumber={5} fetchUser={fetchUser} />
    </div>
  );
}

export default UserAdmin;
