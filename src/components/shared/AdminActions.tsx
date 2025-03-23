const AdminActions = ({ setActiveForm }: { setActiveForm: (form: "user" | "operator" | "point") => void }) => {
    return (
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setActiveForm("user")} className="bg-blue-500 text-white p-3 rounded">
          Добавить пользователя
        </button>
        <button onClick={() => setActiveForm("operator")} className="bg-green-500 text-white p-3 rounded">
          Добавить оператора
        </button>
        <button onClick={() => setActiveForm("point")} className="bg-yellow-500 text-white p-3 rounded">
          Добавить точку на карту
        </button>
      </div>
    );
  };
  
  export default AdminActions;
  