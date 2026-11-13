export const accountTypes=['shopper','creator','brand'] as const;
export type AccountType=typeof accountTypes[number];
export type AccountProfile={user_id:string;account_type:AccountType;display_name:string;city:string;interests:string[];onboarding_completed:boolean};
export const accountLabels:Record<AccountType,string>={shopper:'Shopper',creator:'Creator',brand:'Marca'};
export const accountDestinations:Record<AccountType,string>={shopper:'/painel/shopper',creator:'/painel/criador',brand:'/painel/marca'};
export function isAccountType(value:unknown):value is AccountType{return accountTypes.some(type=>type===value);}
export const accountProfileColumns='user_id,account_type,display_name,city,interests,onboarding_completed';
