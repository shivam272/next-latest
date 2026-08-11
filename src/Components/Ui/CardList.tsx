import Image from "next/image";
import { MapPin, Globe, Users } from "lucide-react";

interface IBadgeProps {
  text: string;
  className?: string;
}

interface ICardProps {
  imageSrc: string;
  id: string;
  title: string;
  description: string;
  height: number;
  width: number;
  mainBadge: IBadgeProps;
  zipcode?: string;
  country?: string;
  capacity: string;
  date?: string;
  time?: string;
  organizer?: string;
  venueName?: string;
  artist?: string;
  price?: string;
  ageRestriction?: string;
  secondaryBadges: IBadgeProps[];
}

interface ICardListProps {
  list: ICardProps[];
}

const Card = (props: ICardProps) => {
  const {
    title,
    height,
    width,
    description,
    zipcode,
    country,
    capacity,
    date,
    time,
    organizer,
    artist,
    price,
    venueName,
    imageSrc,
    ageRestriction,
    mainBadge: { text, className = "" },
    secondaryBadges,
  } = props;

  return (
    <div className="card bg-base-100 w-full max-w-75 overflow-hidden border border-base-200 shadow-sm transition-shadow hover:shadow-md capitalize">
      {/* Image */}
      <figure
        className="relative"
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <Image
          src={imageSrc}
          alt={title}
          height={height}
          width={width}
          className="w-full h-full object-cover"
        />

        {/* Main badge */}
        <div className="absolute right-3 top-3">
          <div className={`badge badge-secondary ${className}`}>{text}</div>
        </div>
      </figure>

      {/* Content */}
      <div className="card-body p-4">
        {/* Title + menu */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="card-title text-lg">{title}</h2>
          </div>
          {price && (
            <div className="flex items-end gap-1">
              <span className="text-md text-base-content/70">Price</span>
              <span className="font-semibold">{`₹${price}`}</span>
            </div>
          )}
        </div>

        {/* Location */}
        {zipcode && country && (
          <div className="flex flex-row gap-1 text-md text-base-content/70 justify-between font-semibold">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0" />
              <span>{zipcode}</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe size={16} className="shrink-0" />
              <span>{country}</span>
            </div>
          </div>
        )}

        <div className="divider my-0" />

        {/* Venue information */}
        <div className="grid grid-cols-2 gap-3">
          {capacity && (
            <div className="rounded-lg bg-base-200/60 p-3">
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <Users size={15} />
                <span>Capacity</span>
              </div>

              <p className="mt-1 font-semibold">{capacity} people</p>
            </div>
          )}

          {country && (
            <div className="rounded-lg bg-base-200/60 p-3">
              <p className="text-xs text-base-content/60">Location</p>
              <p className="mt-1 font-semibold">{country}</p>
            </div>
          )}

          {date && (
            <div className="rounded-lg bg-base-200/60 p-3">
              <p className="text-xs text-base-content/60">Date</p>
              <p className="mt-1 font-semibold">{date}</p>
            </div>
          )}

          {time && (
            <div className="rounded-lg bg-base-200/60 p-3">
              <p className="text-xs text-base-content/60">Time</p>
              <p className="mt-1 font-semibold">{time}</p>
            </div>
          )}

          {organizer && (
            <div className="rounded-lg bg-base-200/60 p-3">
              <p className="text-xs text-base-content/60">Organizer</p>
              <p className="mt-1 font-semibold">{organizer}</p>
            </div>
          )}

          {artist && (
            <div className="rounded-lg bg-base-200/60 p-3">
              <p className="text-xs text-base-content/60">Artist</p>
              <p className="mt-1 font-semibold">{artist}</p>
            </div>
          )}

          {venueName && (
            <div className="rounded-lg bg-base-200/60 p-3">
              <p className="text-xs text-base-content/60">Venue</p>
              <p className="mt-1 font-semibold">{venueName}</p>
            </div>
          )}

          {ageRestriction && (
            <div className="rounded-lg bg-base-200/60 p-3">
              <p className="text-xs text-base-content/60">Age Restriction</p>
              <p className="mt-1 font-semibold">{ageRestriction}</p>
            </div>
          )}
        </div>

        <div className="divider my-0" />

        {/* Description */}
        <p className="line-clamp-2 text-sm text-base-content/70">
          {description}
        </p>

        {/* Secondary badges */}
        {secondaryBadges.length && (
          <div className="card-actions">
            {secondaryBadges.map(({ text, className = "" }, index) => (
              <div
                key={`${text}-${index}`}
                className={`badge badge-outline badge-accent ${className}`}
              >
                {text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CardList = ({ list }: ICardListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
};
