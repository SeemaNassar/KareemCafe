import { supabase } from "../../../lib/supabase";
import AddOfferForm from "./AddOfferForm";
import DeleteOfferButton from "./DeleteOfferButton";

export default async function OffersPage() {
  const { data: offers } = await supabase
    .from("offers")
    .select("*")
    .order("id", { ascending: false });

  return (
    <div className="min-h-screen bg-ink p-8 md:p-12 text-cream">
      <h1 className="font-display text-4xl font-bold text-cream mb-10">
        Offers
      </h1>
      <AddOfferForm />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {offers?.map((offer) => (
          <div
            key={offer.id}
            className="glass rounded-3xl overflow-hidden shadow-luxe"
          >
            {offer.image && (
              <img
                src={offer.image}
                alt={offer.title}
                className="h-52 w-full object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="font-display text-xl font-bold text-cream">
                {offer.title}
              </h3>
              <p className="mt-2 text-cream/55 text-sm">{offer.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    offer.active
                      ? "bg-success/20 text-success"
                      : "bg-error/20 text-error"
                  }`}
                >
                  {offer.active ? "Active" : "Hidden"}
                </span>
                <DeleteOfferButton offer={offer} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
