import { BadRequestException, Injectable } from '@nestjs/common';
import { Camera, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CameraService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CameraUncheckedCreateInput): Promise<Camera> {
    return await this.prisma.camera.create({ data });
  }

  async findAll(): Promise<Camera[]> {
    return await this.prisma.camera.findMany({
      where: { deletedAt: null },
      include: {
        jurisdiction: true,
        user: true,
      },
    });
  }

  async findOne(id: string): Promise<Camera> {
    return await this.getCameraById(id);
  }

  async update(id: string, data: Prisma.ZoneUpdateInput): Promise<Camera> {
    await this.getCameraById(id);
    return this.prisma.camera.update({
      data,
      where: { id },
    });
  }

  async delete(id: string): Promise<Camera> {
    await this.getCameraById(id);
    return this.prisma.camera.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }

  async bulkUpload(rows: any[], user: any) {
    const { userId } = user;
    const parseBoolean = (value: any) =>
      value === true || value === 'true' || value === 'Sí' || value === 'sí';
    const camerasToSave = rows.map((row, index) => {
      const refLat = parseFloat(row.referenciaLat);
      const refLng = parseFloat(row.referenciaLng);
      if (isNaN(refLat) || isNaN(refLng))
        throw new Error(`Fila ${index + 1} no tiene referencia válida`);
      return {
        name: row.nombre,
        direction: row.orientación,
        address: row.dirección,
        cameraType: row.tipoCámara,
        megaphone: parseBoolean(row.megáfono),
        panicButton: parseBoolean(row.botónDePánico),
        cameraMunicipal: parseBoolean(row.cámaraMunicipal),
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(row.longitud), parseFloat(row.latitud)],
        },
        reference: {
          type: 'Point',
          coordinates: [refLng, refLat],
        },
        jurisdictionId: row.jurisdiction,
        userId,
      };
    });
    return await this.prisma.$transaction(
      camerasToSave.map((camera) =>
        this.prisma.camera.create({ data: camera }),
      ),
    );
  }

  private async getCameraById(id: string): Promise<Camera> {
    const camera = await this.prisma.camera.findUnique({
      where: { id },
      include: {
        jurisdiction: true,
        user: true,
      },
    });
    if (!camera) throw new BadRequestException('Camera is not found');
    if (camera.deletedAt) throw new BadRequestException('Camera is deleted');
    return camera;
  }
}
