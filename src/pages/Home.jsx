// import React from "react";
// import axios from "axios";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Button, Input } from "antd";

// const Home = () => {
//   const queryClient = useQueryClient();

//   const { data: usersData = [] } = useQuery({
//     queryKey: ["users"],
//     queryFn: () => axios.get("http://localhost:3000/users"),
//     staleTime: Infinity,
//   });

//   const { mutate:AddUser } = useMutation({
//     mutationFn: (body) => axios.post("http://localhost:3000/users", body),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["users"]);
//     },
//   });

//   const { mutate:DeleteUser } = useMutation({
//     mutationFn: (id) => axios.delete(`http://localhost:3000/users/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["users"]);
//     },
//   });


//   function handleSubmit(e) {
//     e.preventDefault();
//     const data = {
//       id: usersData.data.length + 1 + "",
//       name: e.target.user.value,
//       email: e.target.user.value + "@example.com",
//       age: "20",
//     };
//     AddUser(data);
//   }

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit}
//         className="space-x-3 w-[450px] flex p-5"
//         action=""
//       >
//         <Input
//           className=""
//           placeholder="Add new User"
//           size="large"
//           name="user"
//         />
//         <Button
//           htmlType="submit"
//           className="!bg-gray-900"
//           size="large"
//           type="primary"
//         >
//           Add
//         </Button>
//       </form>
//       <div className="m-5 flex flex-wrap justify-between gap-5">
//         {usersData?.data?.map((item) => (
//           <div key={item.id} className="w-[250px] p-5 rounded-lg bg-slate-300">
//             <h2>Name: {item.name}</h2>
//             <p>Email: {item.email}</p>
//             <p>Age: {item.age}</p>
//             <div className="m-5 flex flex-wrap justify-between gap-5">
//               <Button onClick={() => DeleteUser(item.id)} className="mt-3 !bg-red-700 text-white">
//                 Delete User
//               </Button>
//               <Button className="mt-3 !bg-blue-700 text-white">Edit</Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Home;


import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Modal } from "antd";
import ReactModal from "react-modal";

// Set the app element for React Modal
ReactModal.setAppElement("#root");

const Home = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { data: usersData = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => axios.get("http://localhost:3000/users"),
    staleTime: Infinity,
  });

  const { mutate: AddUser } = useMutation({
    mutationFn: (body) => axios.post("http://localhost:3000/users", body),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const { mutate: DeleteUser } = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:3000/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const { mutate: UpdateUser } = useMutation({
    mutationFn: (user) => axios.put(`http://localhost:3000/users/${user.id}`, user),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setIsModalOpen(false);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      id: usersData.data.length + 1 + "",
      name: e.target.user.value,
      email: e.target.user.value + "@example.com",
      age: "20",
    };
    AddUser(data);
  }

  function handleEdit(user) {
    setEditingUser(user);
    setIsModalOpen(true);
  }

  function handleModalSubmit(e) {
    e.preventDefault();
    const updatedUser = {
      ...editingUser,
      name: e.target.name.value,
      email: e.target.email.value,
      age: e.target.age.value,
    };
    UpdateUser(updatedUser);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-x-3 w-[450px] flex p-5"
      >
        <Input
          placeholder="Add new User"
          size="large"
          name="user"
        />
        <Button
          htmlType="submit"
          className="!bg-gray-900"
          size="large"
          type="primary"
        >
          Add
        </Button>
      </form>
      <div className="m-5 flex flex-wrap justify-between gap-5">
        {usersData?.data?.map((item) => (
          <div key={item.id} className="w-[250px] p-5 rounded-lg bg-slate-300">
            <h2>Name: {item.name}</h2>
            <p>Email: {item.email}</p>
            <p>Age: {item.age}</p>
            <div className="m-5 flex flex-wrap justify-between gap-5">
              <Button onClick={() => DeleteUser(item.id)} className="mt-3 !bg-red-700 text-white">
                Delete User
              </Button>
              <Button onClick={() => handleEdit(item)} className="mt-3 !bg-blue-700 text-white">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit User Modal */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit User"
      >
        <h2>Edit User</h2>
        <form onSubmit={handleModalSubmit} className="space-y-3">
          <Input
            name="name"
            defaultValue={editingUser?.name}
            placeholder="Name"
          />
          <Input
            name="email"
            defaultValue={editingUser?.email}
            placeholder="Email"
          />
          <Input
            name="age"
            defaultValue={editingUser?.age}
            placeholder="Age"
          />
          <Button
            htmlType="submit"
            className="!bg-gray-900"
            size="large"
            type="primary"
          >
            Update
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            className="!bg-gray-500"
            size="large"
            type="default"
          >
            Cancel
          </Button>
        </form>
      </ReactModal>
    </>
  );
};

export default Home;
