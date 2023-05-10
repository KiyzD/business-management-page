export const PositionConsts = {
    kierownik: 'Kierownik',
    pracownik: 'Pracownik'
}

export const PositionMapper = (position: number) => {
    switch (position) {
        case 1:
            return PositionConsts.kierownik;
        case 2:
            return PositionConsts.pracownik;
        default:
            return PositionConsts.pracownik;
    }
}