import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDTO): Promise<Customer> {
    // Verificar se CPF/CNPJ já existe
    const existingCustomer = await this.customersRepository.findOne({
      where: { cpf_cnpj: createCustomerDto.cpf_cnpj },
    });

    if (existingCustomer) {
      throw new ConflictException('CPF/CNPJ já cadastrado no sistema');
    }

    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customersRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['sales', 'sales.vehicle'],
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return customer;
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<Customer | null> {
    return this.customersRepository.findOne({
      where: { cpf_cnpj: cpfCnpj },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDTO): Promise<Customer> {
    const customer = await this.findOne(id);

    // Verificar conflito de CPF/CNPJ se sendo alterado
    if (updateCustomerDto.cpf_cnpj && updateCustomerDto.cpf_cnpj !== customer.cpf_cnpj) {
      const existingCustomer = await this.customersRepository.findOne({
        where: { cpf_cnpj: updateCustomerDto.cpf_cnpj },
      });

      if (existingCustomer) {
        throw new ConflictException('CPF/CNPJ já cadastrado no sistema');
      }
    }

    await this.customersRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customersRepository.remove(customer);
  }

  async search(term: string): Promise<Customer[]> {
    return this.customersRepository
      .createQueryBuilder('customer')
      .where('LOWER(customer.name) LIKE LOWER(:term)', { term: `%${term}%` })
      .orWhere('customer.cpf_cnpj LIKE :term', { term: `%${term}%` })
      .orWhere('LOWER(customer.email) LIKE LOWER(:term)', { term: `%${term}%` })
      .getMany();
  }
}