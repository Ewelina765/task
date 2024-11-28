import { useEffect, useState } from "react";

import { useGetListData } from "../api/getListData";
import { Card } from "./List";
import { Spinner } from "./Spinner";
import { useStore } from "../store";


export const Entrypoint = () => {
  const [isDeletedCardsVisible, setIsDeletedCardsVisible] = useState(false);

  const {
    visibleCards,
    deletedCards,
    expandedIds,
    setVisibleCards,
    removeCard,
    revertCard,
    toggleExpanded,
    refreshCards
  } = useStore();

  const listQuery = useGetListData();

  useEffect(() => {
    if (listQuery.isLoading) {
      return;
    }

    setVisibleCards(listQuery.data?.filter((item) => item.isVisible) ?? []);
  }, [listQuery.data, listQuery.isLoading, refreshCards]);

  if (listQuery.isLoading) {
    return <Spinner />;
  }

  const handleRefresh = () => {
    listQuery.refetch();
  };

  return (
    <div className="flex gap-x-16">
      <div className="w-full max-w-xl">
        <h1 className="mb-1 font-medium text-lg">My Awesome List ({visibleCards.length})</h1>
        <div className="flex flex-col gap-y-3">
          {visibleCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              description={card.description}
              id={card.id}
              removeCard={removeCard}
              variant='default'
              isExpanded={expandedIds.includes(card.id)}
              toggleExpand={() => toggleExpanded(card.id)} />
          ))}
        </div>
      </div>
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between">
          <h1 className="mb-1 font-medium text-lg">Deleted Cards ({deletedCards.length})</h1>
          <button
            onClick={() => setIsDeletedCardsVisible(!isDeletedCardsVisible)}
            disabled={deletedCards.length === 0}
            className="text-white text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1"
          >
            {isDeletedCardsVisible ? 'Hide' : 'Reveal'}
          </button>
        </div>
        <div className="flex flex-col gap-y-3">
          {isDeletedCardsVisible && deletedCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              id={card.id}
              revertCard={revertCard}
              variant='deleted'
            />
          ))}
        </div>
      </div>
      <button
        onClick={handleRefresh}
        className="text-white h-7 text-sm transition-colors hover:bg-gray-800 disabled:bg-black/75 bg-black rounded px-3 py-1"
      >
        Refresh
      </button>
    </div>
  );
};
