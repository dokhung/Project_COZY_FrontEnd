'use client';

import * as React from 'react';

export function AlertDialog({
                                open,
                                onOpenChange,
                                children,
                            }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    children: React.ReactNode;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                {children}
            </div>
        </div>
    );
}

export function AlertDialogContent({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
}

export function AlertDialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-4">{children}</div>;
}

export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-bold mb-2">{children}</h2>;
}

export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-sm text-gray-600">{children}</p>;
}

export function AlertDialogFooter({ children }: { children: React.ReactNode }) {
    return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
}

export function AlertDialogCancel({
                                      children,
                                      onClick,
                                  }: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
            {children}
        </button>
    );
}

export function AlertDialogAction({
                                      children,
                                      onClick,
                                  }: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
            {children}
        </button>
    );
}
