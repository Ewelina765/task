import { FC } from "react";

import { ListItem } from "../api/getListData";
import { ToggleButton } from "./Buttons";
import { ChevronDownIcon, ChevronUpIcon, RevertIcon, XMarkIcon } from "./icons";

type CardVariant = 'default' | 'deleted';

type CardProps = {
  title: ListItem["title"];
  description?: ListItem["description"];
  id?: ListItem["id"];
  removeCard?: (id: number) => void;
  revertCard?: (id: number) => void;
  variant: CardVariant;
  isExpanded?: boolean;
  toggleExpand?: () => void;
};

export const Card: FC<CardProps> = ({ title, description, id, removeCard, variant, revertCard, isExpanded, toggleExpand }) => {

  const isDefaultVariant = variant === 'default';

  return (
    <div
      className="rounded-lg border border-gray-300 p-3 transition-all duration-200 animate-fade-in bg-gray-50"
    >
      <div className="flex justify-between mb-0.5">
        <h1 className="font-medium">{title}</h1>
        <div className="flex">
          {isDefaultVariant && (
            <ToggleButton onClick={toggleExpand}>
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </ToggleButton>
          )}
          {isDefaultVariant && (
            <ToggleButton onClick={() => removeCard?.(id!)}>
              <XMarkIcon />
            </ToggleButton>
          )}
          {!isDefaultVariant && (
            <ToggleButton onClick={() => revertCard?.(id!)}>
              <RevertIcon />
            </ToggleButton>
          )}
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}>
        {isDefaultVariant && <p className="text-sm">{description}</p>}
      </div>
    </div>
  );
};
