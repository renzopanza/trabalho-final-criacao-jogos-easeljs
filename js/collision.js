const Collision = {
    checkRect(a, b) {
        const A = a.getBounds();
        const B = b.getBounds();

        return (
            A.x < B.x + B.width &&
            A.x + A.width > B.x &&
            A.y < B.y + B.height &&
            A.height + A.y > B.y
        );
    }
};
