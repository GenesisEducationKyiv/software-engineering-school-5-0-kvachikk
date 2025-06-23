import { FrequencyModel } from '../models/frequency.model';

export const seedFrequencies = async (): Promise<void> => {
   const existing = await FrequencyModel.count();
   if (existing > 0) {
      return;
   }

   await FrequencyModel.bulkCreate([{ title: 'HOURLY' } as FrequencyModel, { title: 'DAILY' } as FrequencyModel]);
};
