import { supabase } from "../../lib/supabase";

export default async function OffersSection() {
  const { data: offers } = await supabase
    .from("offers")
    .select("*")
    .eq("active", true);

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <h2
          className="
          text-5xl
          font-black
          text-center
          text-[#2A1F1A]
          mb-16
          "
        >
          🔥 Special Offers
        </h2>

        <div
          className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-8
          "
        >
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="
              bg-white
              rounded-[30px]
              overflow-hidden
              shadow-lg
              hover:shadow-2xl
              transition-all
              duration-500
              "
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="
                w-full
                h-64
                object-cover
                "
              />

              <div className="p-6">
                <h3
                  className="
                  text-2xl
                  font-bold
                  text-[#2A1F1A]
                  "
                >
                  {offer.title}
                </h3>

                <p
                  className="
                  text-gray-600
                  mt-3
                  "
                >
                  {offer.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}