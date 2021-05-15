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
        shouldShowOnline,
      }: { limit: number; offset: number; search: string, shouldShowOnline: boolean }
    ) => {
      const advisorsList: any = await returnAdvisorsList();
      let filteradvisorsList = [];
      if (search || shouldShowOnline) {
        let i = 0;
        while (filteradvisorsList.length < offset + limit && advisorsList[i]) {
          for (let key in advisorsList[i]) {
            if (
              advisorsList[i][key] &&
              advisorsList[i][key]
                .toString()
                .toLowerCase()
                .indexOf(search.toLowerCase()) > -1
            ) {
              if(shouldShowOnline) {
                if(advisorsList[i]['status'] == 'online') {
                  filteradvisorsList.push(advisorsList[i]);
                  break;
                }
              } else {
                filteradvisorsList.push(advisorsList[i]);
                break;
              }
            }
          }
          i++;
        }
      } else {
        filteradvisorsList = advisorsList;
      }
      return filteradvisorsList.slice(offset).slice(0, limit);
    },
  },
};
