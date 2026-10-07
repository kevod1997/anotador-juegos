import React from 'react';
import { motion } from 'motion/react';
import { Eraser, X } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Button from './Button';
import DiceFace from './DiceFace';
import { cn } from '../lib/cn';

const isNumberCategory = (cat) => /^[1-6]$/.test(cat.id);

function OptionButton({ selected, onClick, value, caption, className }) {
    return (
        <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onClick}
            className={cn(
                'flex flex-col items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 transition-colors active:bg-primary/20',
                selected && 'bg-primary text-background-dark ring-primary',
                className
            )}
        >
            <span className="text-2xl font-extrabold leading-none tabular">{value}</span>
            {caption && (
                <span className={cn('mt-1 text-[11px] font-semibold uppercase tracking-wide', selected ? 'text-background-dark/70' : 'text-primary/60')}>
                    {caption}
                </span>
            )}
        </motion.button>
    );
}

export default function ScoreSelector({ isOpen, onClose, onSelect, onClear, category, current, title, icon }) {
    if (!category) return <BottomSheet open={false} onClose={onClose} />;
    const numeric = isNumberCategory(category);
    const value = Number(category.id);

    let subtitle;
    if (numeric) subtitle = `Suma de los ${value}`;
    else if (category.served) subtitle = `${category.label} · Armada ${category.points} / Servida ${category.served === 'GANA' ? 'gana' : category.served}`;
    else subtitle = `${category.label} · ${category.points} puntos`;

    return (
        <BottomSheet
            open={isOpen}
            onClose={onClose}
            title={title}
            subtitle={subtitle}
            icon={icon}
        >
            {numeric ? (
                <>
                    <div className="mb-2 flex items-center gap-2 text-sm text-white/50">
                        <DiceFace value={value} size={18} />
                        ¿Cuántos dados con {value}?
                    </div>
                    <div className="mb-4 grid grid-cols-5 gap-2">
                        {category.options.map((opt, i) => (
                            <OptionButton
                                key={opt}
                                value={opt}
                                caption={`${i + 1} ${i === 0 ? 'dado' : 'dados'}`}
                                selected={current === opt}
                                onClick={() => onSelect(opt)}
                                className="h-[72px]"
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className={cn('mb-4 grid gap-3', category.served ? 'grid-cols-2' : 'grid-cols-1')}>
                    <OptionButton
                        value={category.points}
                        caption={category.served ? 'Armada' : 'Anotar'}
                        selected={current === category.points}
                        onClick={() => onSelect(category.points)}
                        className="h-20"
                    />
                    {category.served && (
                        <OptionButton
                            value={category.served === 'GANA' ? '¡Gana!' : category.served}
                            caption="Servida"
                            selected={current === category.served}
                            onClick={() => onSelect(category.served)}
                            className={cn('h-20', category.served === 'GANA' && current !== 'GANA' && 'bg-gold/10 text-gold ring-gold/30 active:bg-gold/20')}
                        />
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <Button variant="danger" onClick={() => onSelect(0)} className={cn(current === 0 && 'bg-red-500/25')}>
                    <X size={18} strokeWidth={2.5} />
                    Tachar
                </Button>
                <Button variant="ghost" onClick={onClear} disabled={current === undefined}>
                    <Eraser size={18} />
                    Borrar
                </Button>
            </div>
        </BottomSheet>
    );
}
