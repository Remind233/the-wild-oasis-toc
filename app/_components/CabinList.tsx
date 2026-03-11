import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "@/app/_lib/data-service";
import { unstable_noStore } from "next/cache";

// interface Cabin {
//   id: number;
//   name: string;
//   maxCapacity: number;
//   regularPrice: number;
//   discount: number;
//   description?: string;
//   image: string;
// }

async function CabinList({ filter }: { filter: string }) {
  //动态渲染
  // unstable_noStore();

  const cabins = await getCabins();

  if (!cabins.length) return null;

  let dispalyedCabins = cabins;
  if (filter === "all") dispalyedCabins = cabins;
  if (filter === "small")
    dispalyedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 2);
  if (filter === "medium")
    dispalyedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity <= 4 && cabin.maxCapacity > 2,
    );
  if (filter === "large")
    dispalyedCabins = cabins.filter((cabin) => cabin.maxCapacity > 4);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {dispalyedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
