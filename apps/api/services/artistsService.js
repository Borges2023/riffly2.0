import { artistsRepository } from "../repositories/artistsRepository.js";

export const artistsService = {
  list: () => artistsRepository.findAll(),
  getById: (id) => artistsRepository.findById(id),
};
