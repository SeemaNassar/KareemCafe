import Image from "next/image";
import { fetchAllOffers } from "../../../services/home";
import AddOfferForm from "./AddOfferForm";
import DeleteOfferButton from "./DeleteOfferButton";
import AdminBackButton from "../AdminBackButton";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const offers = await fetchAllOffers();

  return (
    <div className="min-h-screen bg-ink p-8 md:p-12 text-cream">
      <AdminBackButton />
      <h1 className="font-display text-4xl font-bold text-cream mb-10">
        العروض
      </h1>
      <AddOfferForm />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="glass rounded-3xl overflow-hidden shadow-luxe"
          >
            {offer.image && (
              <div className="relative h-52 w-full">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
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
                  {offer.active ? "مفعّل" : "مخفي"}
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
