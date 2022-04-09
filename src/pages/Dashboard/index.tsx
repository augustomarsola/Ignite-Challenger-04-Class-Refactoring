import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface Foods {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

interface FoodProps {
  foods: Array<Foods>;
  editingFood: { id?: number };
  modalOpen: boolean;
  editModalOpen: boolean;
}

export function Dashboard() {
  const [foodControl, setFoodControl] = useState<FoodProps>({
    foods: [],
    editingFood: {},
    modalOpen: false,
    editModalOpen: false,
  });

  useEffect(() => {
    async function getFoods() {
      const response = await api.get("/foods");
      setFoodControl({ ...foodControl, foods: response.data });
    }
    getFoods();
  }, []);

  async function handleAddFood(food: Foods) {
    const { foods } = foodControl;

    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoodControl({ ...foodControl, foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Foods) {
    const { foods, editingFood } = foodControl;

    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoodControl({ ...foodControl, foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    const { foods } = foodControl;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoodControl({ ...foodControl, foods: foodsFiltered });
  }

  function toggleModal() {
    const { modalOpen } = foodControl;

    setFoodControl({ ...foodControl, modalOpen: !modalOpen });
  }

  function toggleEditModal() {
    const { editModalOpen } = foodControl;

    setFoodControl({ ...foodControl, editModalOpen: !editModalOpen });
  }

  function handleEditFood(food: Foods) {
    setFoodControl({ ...foodControl, editingFood: food, editModalOpen: true });
  }

  const { modalOpen, editModalOpen, editingFood, foods } = foodControl;

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
