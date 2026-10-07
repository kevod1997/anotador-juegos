import React, { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from './Button';
import Avatar from './Avatar';

// Hoja para nombrar / eliminar un jugador. player = { id, name, index, isNew }
// `player` se mantiene mientras la hoja se cierra para que la animación de salida no pierda el contenido
export default function PlayerSheet({ open, player, onClose, onSave, onDelete, canDelete }) {
    const [name, setName] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!open || !player) return;
        setName(player.name);
        setConfirmDelete(false);
        // Seleccionar el nombre para reemplazarlo directamente
        const t = setTimeout(() => inputRef.current?.select(), 250);
        return () => clearTimeout(t);
    }, [open, player]);

    const save = () => {
        if (!open) return;
        onSave(name.trim() || player.name);
        onClose();
    };

    return (
        <BottomSheet
            open={open}
            onClose={save}
            title={player?.isNew ? 'Nuevo jugador' : 'Editar jugador'}
            icon={player && <Avatar name={name || player.name} index={player.index} size={40} />}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    save();
                }}
            >
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/45" htmlFor="player-name">
                    Nombre
                </label>
                <input
                    id="player-name"
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    autoComplete="off"
                    enterKeyHint="done"
                    className="mb-5 h-14 w-full rounded-2xl border-0 bg-white/[0.06] px-4 text-lg font-semibold text-white ring-1 ring-inset ring-white/10 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Juan"
                />
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        type="button"
                        variant="danger"
                        disabled={!canDelete}
                        onClick={() => {
                            if (!confirmDelete) {
                                setConfirmDelete(true);
                                return;
                            }
                            onDelete();
                            onClose();
                        }}
                    >
                        <Trash2 size={18} />
                        {confirmDelete ? '¿Seguro?' : 'Eliminar'}
                    </Button>
                    <Button type="submit">Listo</Button>
                </div>
            </form>
        </BottomSheet>
    );
}
