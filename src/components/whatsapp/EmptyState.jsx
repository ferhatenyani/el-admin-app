import { MessagesSquare } from 'lucide-react';

const EmptyState = () => (
  <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
      <MessagesSquare className="h-8 w-8" />
    </div>
    <div>
      <p className="font-medium text-gray-700">Sélectionnez une conversation</p>
      <p className="mt-1 text-sm text-gray-400">
        Choisissez une conversation à gauche pour voir l'historique et répondre au client.
      </p>
    </div>
  </div>
);

export default EmptyState;
