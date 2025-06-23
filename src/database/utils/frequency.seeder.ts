import { FrequencyModel } from '../models/frequency.model';

export const seedFrequencies = async (): Promise<void> => {
   const existing = await FrequencyModel.count();
   if (existing > 0) {
      return;
   }

   const { FREQUENCIES } = FrequencyModel;

   await FrequencyModel.bulkCreate([
      { title: FREQUENCIES.HOURLY } as FrequencyModel,
      { title: FREQUENCIES.DAILY } as FrequencyModel,
   ]);
};
