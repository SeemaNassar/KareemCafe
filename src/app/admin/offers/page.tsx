import { supabase } from "../../../lib/supabase";
import AddOfferForm from "./AddOfferForm";
import DeleteOfferButton from "./DeleteOfferButton";

export default async function OffersPage() {
  const { data: offers } =
    await supabase
      .from("offers")
      .select("*")
      .order("id", {
        ascending: false,
      });

  return (
    <div className="p-10">
      <h1
        className="
        text-4xl
        font-bold
        mb-8
        "
      >
        Offers
      </h1>

      <AddOfferForm />

      <div
        className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
        mt-10
        "
      >
        {offers?.map((offer) => (
          <div
            key={offer.id}
            className="
            bg-white
            rounded-3xl
            overflow-hidden
            shadow
            "
          >
            {offer.image && (
              <img
                src={offer.image}
                alt={offer.title}
                className="
                h-52
                w-full
                object-cover
                "
              />
            )}

            <div className="p-5">
              <h3
                className="
                text-xl
                font-bold
                "
              >
                {offer.title}
              </h3>

              <p
                className="
                text-gray-600
                mt-2
                "
              >
                {offer.description}
              </p>

              <div
                className="
                mt-4
                flex
                justify-between
                items-center
                "
              >
                <span>
                  {offer.active
                    ? "🟢 Active"
                    : "🔴 Hidden"}
                </span>

                <DeleteOfferButton
                  offer={offer}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}