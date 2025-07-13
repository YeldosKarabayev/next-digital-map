-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionCoordinate" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "RegionCoordinate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegionCoordinate" ADD CONSTRAINT "RegionCoordinate_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;
