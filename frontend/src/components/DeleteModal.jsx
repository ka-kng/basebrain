import React from "react";

export default function DeleteModal({ type, onCancel, onConfirm }) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h3 className="text-lg font-bold mb-4">削除確認</h3>
        <p className="mb-1">本当に削除しますか？</p>
        <p className="mb-5">この操作は元に戻せません。</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
