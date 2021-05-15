import faker from "faker";
import { Advisor } from "../interfaces/advisors";

export const generateAdvisors = (amountOfAdvisors: number): Advisor[] => {
  const advisors = [];
  for (let id = 1; id <= amountOfAdvisors; id++) {
    const name = `${faker.name.firstName()} ${faker.name.lastName()} ${id}`;
    const language = faker.address.country();
    const reviews = +faker.datatype.number(3000);
    advisors.push({
      id,
      name,
      language,
      reviews,
      status: Math.random() > 0.25 ? "online" : "offline",
    });
  }
  return advisors;
};
