import InfiniteScroll from "react-infinite-scroll-component";
import { ClipLoader } from "react-spinners";

import { AvailabilityFilter } from "@/components/shared/availability-filter";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { RentCard } from "@/components/shared/rent-card";
import { RenderIf } from "@/components/shared/RenderIf";
import { Filters } from "./components/Filters";
import { LIST_TAKE_COUNT } from "@/constants";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import rentService from "@/services/rent";
import { useAppSelector } from "@/hooks/redux";
import { selectAuth } from "@/store/auth";

export const FavoriteRentListPage = () => {
  const { favorites } = useAppSelector(selectAuth);

  const [searchParams] = useSearchParams();
  const dropOffLocation = searchParams.get("dropoff_location");
  const pickUpLocation = searchParams.get("pickup_location");
  const categories = searchParams.getAll("category");
  const capacities = searchParams.getAll("capacity");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.FAVORITE_RENT_LIST, searchParams.toString()],
    queryFn: ({ pageParam }) =>
      rentService.getAll({
        skip: pageParam,
        take: 3,
        dropOffLocation,
        pickUpLocation,
        categories,
        capacities,
        minPrice,
        maxPrice,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const hasMore =
        lastPage.data.count > lastPage.data.skip + lastPage.data.take;
      if (hasMore) {
        return lastPage.data.skip + lastPage.data.take;
      }
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const rents =
    data?.pages.reduce(
      (prev, page) => [...prev, ...page.data.items],
      [] as any[]
    ) || [];

  const favRents = rents.filter((rent) => favorites?.includes(rent._id));

  return (
    <div className="grid xl:grid-cols-[1fr] h-[100vh] overflow-y-auto">
      <ScrollToTop />
      <div className="flex flex-col gap-y-6 lg:gap-y-8 pt-6 lg:pt-8 px-6 lg:px-8 pb-10">
        <InfiniteScroll
          dataLength={favRents.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="flex flex-col items-center w-60 mx-auto gap-x-3 text-muted-foreground mt-4">
              <ClipLoader />
              <p>Loading more items...</p>
            </div>
          }
          endMessage={
            <>
              <RenderIf condition={favRents.length === 0}>
                <p className="mt-4 text-center text-muted-foreground">
                  No Favorite Rents Found
                </p>
              </RenderIf>
            </>
          }
        >
          <div className="grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 ">
            <RenderIf condition={isLoading}>
              {[...Array(LIST_TAKE_COUNT)].map((_, index) => (
                <RentCard.Skeleton key={index} />
              ))}
            </RenderIf>

            {favRents.map((rent) => (
              <RentCard key={rent._id} rent={rent} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default FavoriteRentListPage;
