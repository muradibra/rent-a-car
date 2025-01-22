import { AvailabilityFilter } from "@/components/shared/availability-filter";
import { Hero } from "./components/Hero";
import { RentList } from "../../../components/shared/RentList";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import rentService from "@/services/rent";

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.RENT_LIST],
    queryFn: () => rentService.getAll(),
  });

  const { data: popularData, isLoading: isPending } = useQuery({
    queryKey: [QUERY_KEYS.RENT_POPULAR_LIST],
    queryFn: () => rentService.getPopular(),
  });

  const rents = data?.data?.items || [];
  const popularRents = popularData?.data?.items || [];

  return (
    <div className="container pt-4 lg:pt-8 pb-8 lg:pb-16 flex flex-col gap-y-6 lg:gap-y-8">
      <Hero />
      <AvailabilityFilter />
      <RentList
        heading="Popular Cars"
        isLoading={isPending}
        rents={popularRents}
      />
      <RentList heading="Rental Cars" isLoading={isLoading} rents={rents} />
    </div>
  );
};

export default HomePage;
