import { create } from "zustand";
import { ListItem } from './api/getListData';

type State = {
    visibleCards: ListItem[];
    deletedCards: ListItem[];
    expandedIds: number[];
};

type Actions = {
    setVisibleCards: (cards: ListItem[]) => void;
    setDeletedCards: (cards: ListItem[]) => void;
    toggleExpanded: (id: number) => void;
    removeCard: (id: number) => void;
    revertCard: (id: number) => void;
    refreshCards: (newCards: ListItem[]) => void;
};

export const useStore = create<State & Actions>((set) => ({
    visibleCards: [],
    deletedCards: [],
    expandedIds: [],
    setVisibleCards: (cards) => set({ visibleCards: cards }),
    setDeletedCards: (cards) => set({ deletedCards: cards }),
    toggleExpanded: (id) => set((state) => ({
        expandedIds: state.expandedIds.includes(id)
            ? state.expandedIds.filter(expandedId => expandedId !== id)
            : [...state.expandedIds, id]
    })),
    removeCard: (id) => set((state) => {
        const cardToRemove = state.visibleCards.find(card => card.id === id);
        if (cardToRemove) {
            return {
                visibleCards: state.visibleCards.filter(card => card.id !== id),
                deletedCards: [...state.deletedCards, { ...cardToRemove, isVisible: false }]
            };
        }
        return state;
    }),
    revertCard: (id) => set((state) => {
        const cardToRevert = state.deletedCards.find(card => card.id === id);
        if (cardToRevert) {
            return {
                deletedCards: state.deletedCards.filter(card => card.id !== id),
                visibleCards: [...state.visibleCards, { ...cardToRevert, isVisible: true }]
            };
        }
        return state;
    }),
    refreshCards: (newCards) => set((state) => {
        const updatedVisibleCards = newCards.map(card => ({
            ...card,
            isVisible: !state.deletedCards.some(dc => dc.id === card.id)
        }));
        return {
            visibleCards: updatedVisibleCards.filter(card => card.isVisible),
            deletedCards: state.deletedCards,    
            expandedIds: state.expandedIds
        };
    }),

}));
