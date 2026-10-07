import React, { useEffect, useState } from 'react';
import { Reorder, useDragControls } from 'motion/react';
import { ChevronDown, ChevronUp, GripVertical, Layers } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from './Button';
import Avatar from './Avatar';
import { CARIOCA_TOTAL_HANDS } from '../consts/carioca';
import { cn } from '../lib/cn';

const MoveButton = ({ label, disabled, onClick, children }) => (
    <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className="flex size-8 items-center justify-center rounded-full text-white/50 transition active:scale-90 active:bg-white/10 disabled:opacity-20"
    >
        {children}
    </button>
);

function OrderRow({ player, index, count, isDealer, deals, onPick, onMove }) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={player}
            dragListener={false}
            dragControls={controls}
            className={cn(
                'relative flex items-center gap-2 rounded-2xl py-2 pl-1 pr-1.5 ring-1 ring-inset transition-colors',
                isDealer ? 'bg-primary/[0.08] ring-primary/50' : 'bg-white/[0.04] ring-white/5'
            )}
        >
            <span
                onPointerDown={(e) => controls.start(e)}
                aria-hidden="true"
                className="flex h-10 w-7 shrink-0 cursor-grab touch-none items-center justify-center text-white/30 active:cursor-grabbing"
            >
                <GripVertical size={18} />
            </span>
            <button type="button" onClick={onPick} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`Reparte ${player.name}`}>
                <span className="w-4 shrink-0 text-center text-sm font-bold text-white/35 tabular">{index + 1}</span>
                <Avatar name={player.name} index={player.color ?? index} size={34} />
                <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{player.name}</span>
                    <span className={cn('block text-xs font-medium leading-snug', isDealer ? 'text-primary' : 'text-white/40')}>
                        {deals.length === 0
                            ? 'No reparte en las manos que quedan'
                            : `${isDealer ? 'Ahora · ' : 'Reparte '}${deals.length === 1 ? 'mano' : 'manos'} ${deals.join(' · ')}`}
                    </span>
                </span>
                {isDealer && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-background-dark">
                        <Layers size={15} strokeWidth={2.5} />
                    </span>
                )}
            </button>
            <div className="flex shrink-0 flex-col">
                <MoveButton label={`Subir a ${player.name}`} disabled={index === 0} onClick={() => onMove(-1)}>
                    <ChevronUp size={16} />
                </MoveButton>
                <MoveButton label={`Bajar a ${player.name}`} disabled={index === count - 1} onClick={() => onMove(1)}>
                    <ChevronDown size={16} />
                </MoveButton>
            </div>
        </Reorder.Item>
    );
}

// Hoja para ordenar la ronda de repartida y elegir quién reparte la mano actual.
// players: en orden de repartida; cada uno trae su color fijo para que el avatar no cambie al moverlo
export default function DealOrderSheet({ open, setup = false, players, dealerId, handNumber, onConfirm, onCancel }) {
    const [order, setOrder] = useState(players);
    const [dealer, setDealer] = useState(dealerId);

    // Borrador nuevo en cada apertura
    useEffect(() => {
        if (!open) return;
        setOrder(players);
        setDealer(dealerId ?? players[0]?.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const dealerIndex = Math.max(0, order.findIndex((p) => p.id === dealer));
    const remaining = Array.from({ length: Math.max(0, CARIOCA_TOTAL_HANDS - handNumber + 1) }, (_, k) => handNumber + k);
    const dealsOf = (index) => remaining.filter((_, k) => (dealerIndex + k) % order.length === index);

    const move = (index, delta) => {
        setOrder((o) => {
            const next = [...o];
            const [item] = next.splice(index, 1);
            next.splice(index + delta, 0, item);
            return next;
        });
    };

    return (
        <BottomSheet
            open={open}
            dismissible={false}
            title="Orden de repartida"
            subtitle={setup ? '¿Quién reparte la primera mano?' : `Mano ${handNumber} de ${CARIOCA_TOTAL_HANDS}`}
        >
            <p className="mb-3 text-sm leading-snug text-white/55">
                Se reparte siguiendo esta lista, de arriba hacia abajo, y después del último vuelve al primero.
                Arrastrá o usá las flechas para acomodarla como están sentados y tocá a quien reparte{setup ? ' primero' : ' esta mano'}.
            </p>

            <Reorder.Group
                axis="y"
                values={order}
                onReorder={setOrder}
                layoutScroll
                className="no-scrollbar mb-5 max-h-[46dvh] space-y-2 overflow-y-auto overscroll-contain"
            >
                {order.map((player, i) => (
                    <OrderRow
                        key={player.id}
                        player={player}
                        index={i}
                        count={order.length}
                        isDealer={player.id === dealer}
                        deals={dealsOf(i)}
                        onPick={() => setDealer(player.id)}
                        onMove={(delta) => move(i, delta)}
                    />
                ))}
            </Reorder.Group>

            <div className="grid grid-cols-[1fr_1.8fr] gap-3">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    {setup ? 'Volver' : 'Cancelar'}
                </Button>
                <Button type="button" onClick={() => onConfirm(order, dealer)}>
                    {setup ? 'Empezar' : 'Guardar orden'}
                </Button>
            </div>
        </BottomSheet>
    );
}
