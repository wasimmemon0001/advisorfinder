import { generateAdvisors } from "../utils/utils";

const advisors = generateAdvisors(1500);

const delay = 500;

const returnAdvisorsList = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(advisors);
    }, delay);
  });

export const resolvers = {
  Query: {
    advisors: async (
      _: any,
      {
        limit,
        offset,
        search,
      }: { limit: number; offset: number; search: string }
    ) => {
      const advisorsList: any = await returnAdvisorsList();
      console.log("start..........." + search);
      let filteradvisorsList = [];
      if (search) {
        let i = 0;
        while (filteradvisorsList.length < offset + limit && advisorsList[i]) {
          console.log(search + "..........." + i);
          for (let key in advisorsList[i]) {
            if (
              advisorsList[i][key] &&
              advisorsList[i][key]
                .toString()
                .toLowerCase()
                .indexOf(search.toLowerCase()) > -1
            ) {
              filteradvisorsList.push(advisorsList[i]);
              break;
            }
          }
          i++;
        }
      } else {
        filteradvisorsList = advisorsList;
      }
      console.log("end...........");
      return filteradvisorsList.slice(offset).slice(0, limit);
    },
  },
};
